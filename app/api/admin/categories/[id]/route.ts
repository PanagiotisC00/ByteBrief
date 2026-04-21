import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { PostStatus } from '@prisma/client'
import { getCurrentSession } from '@/lib/utils/auth'
import { prisma } from '@/lib/prisma'
import { adminIdParamsSchema, categoryBodySchema, formatZodError } from '@/lib/validation/admin'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getCurrentSession()
    
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const parsedParams = adminIdParamsSchema.safeParse(await params)
    if (!parsedParams.success) {
      return NextResponse.json({ error: 'Invalid category id' }, { status: 400 })
    }

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const parsedBody = categoryBodySchema.safeParse(body)
    if (!parsedBody.success) {
      return NextResponse.json(formatZodError(parsedBody.error), { status: 400 })
    }

    const { id } = parsedParams.data
    const { name, slug, description, color, icon } = parsedBody.data

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
      select: {
        id: true,
        slug: true,
      },
    })

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    // Check if slug conflicts with another category (excluding current one)
    const slugConflict = await prisma.category.findFirst({
      where: {
        OR: [
          { name },
          { slug },
        ],
        NOT: { id }
      }
    })

    if (slugConflict) {
      return NextResponse.json(
        { error: slugConflict.slug === slug ? 'A category with this slug already exists' : 'A category with this name already exists' },
        { status: 400 }
      )
    }

    // Update the category
    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
        description: description || null,
        color: color || '#3B82F6',
        icon: icon || 'FolderOpen'
      }
    })

    // Revalidate relevant pages
    revalidatePath('/admin/categories')
    revalidatePath('/admin')
    revalidatePath('/')
    revalidatePath('/blog')
    revalidatePath('/news')
    revalidatePath(`/category/${category.slug}`)
    if (existingCategory.slug !== category.slug) {
      revalidatePath(`/category/${existingCategory.slug}`)
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getCurrentSession()
    
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const parsedParams = adminIdParamsSchema.safeParse(await params)
    if (!parsedParams.success) {
      return NextResponse.json({ error: 'Invalid category id' }, { status: 400 })
    }

    const { id } = parsedParams.data

    // Check if category exists and has posts
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            posts: {
              where: {
                status: PostStatus.PUBLISHED
              }
            }
          }
        }
      }
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    if (category._count.posts > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with published posts' },
        { status: 400 }
      )
    }

    // Delete the category
    await prisma.category.delete({
      where: { id }
    })

    // Revalidate relevant pages
    revalidatePath('/admin/categories')
    revalidatePath('/admin')
    revalidatePath('/')
    revalidatePath('/blog')
    revalidatePath('/news')
    revalidatePath(`/category/${category.slug}`)

    return NextResponse.json({ message: 'Category deleted successfully' })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
