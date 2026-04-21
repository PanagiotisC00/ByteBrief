import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { PostStatus } from '@prisma/client'
import { getCurrentSession } from '@/lib/utils/auth'
import { prisma } from '@/lib/prisma'
import { adminIdParamsSchema, formatZodError, tagBodySchema } from '@/lib/validation/admin'

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
      return NextResponse.json({ error: 'Invalid tag id' }, { status: 400 })
    }

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const parsedBody = tagBodySchema.safeParse(body)
    if (!parsedBody.success) {
      return NextResponse.json(formatZodError(parsedBody.error), { status: 400 })
    }

    const { id } = parsedParams.data
    const { name, slug } = parsedBody.data

    // Check if tag exists
    const existingTag = await prisma.tag.findUnique({
      where: { id },
      select: {
        id: true,
        slug: true,
      },
    })

    if (!existingTag) {
      return NextResponse.json(
        { error: 'Tag not found' },
        { status: 404 }
      )
    }

    // Check if slug conflicts with another tag (excluding current one)
    const slugConflict = await prisma.tag.findFirst({
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
        { error: slugConflict.slug === slug ? 'A tag with this slug already exists' : 'A tag with this name already exists' },
        { status: 400 }
      )
    }

    // Update the tag
    const tag = await prisma.tag.update({
      where: { id },
      data: {
        name,
        slug
      }
    })

    // Revalidate relevant pages
    revalidatePath('/admin/tags')
    revalidatePath('/admin')
    revalidatePath('/')
    revalidatePath('/blog')
    revalidatePath('/news')
    revalidatePath(`/tag/${tag.slug}`)
    if (existingTag.slug !== tag.slug) {
      revalidatePath(`/tag/${existingTag.slug}`)
    }

    return NextResponse.json(tag)
  } catch (error) {
    console.error('Error updating tag:', error)
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
      return NextResponse.json({ error: 'Invalid tag id' }, { status: 400 })
    }

    const { id } = parsedParams.data

    // Check if tag exists and has posts
    const tag = await prisma.tag.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            posts: {
              where: {
                post: {
                  status: PostStatus.PUBLISHED
                }
              }
            }
          }
        }
      }
    })

    if (!tag) {
      return NextResponse.json(
        { error: 'Tag not found' },
        { status: 404 }
      )
    }

    if (tag._count.posts > 0) {
      return NextResponse.json(
        { error: 'Cannot delete tag that is used in published posts' },
        { status: 400 }
      )
    }

    // Delete the tag
    await prisma.tag.delete({
      where: { id }
    })

    // Revalidate relevant pages
    revalidatePath('/admin/tags')
    revalidatePath('/admin')
    revalidatePath('/')
    revalidatePath('/blog')
    revalidatePath('/news')
    revalidatePath(`/tag/${tag.slug}`)

    return NextResponse.json({ message: 'Tag deleted successfully' })
  } catch (error) {
    console.error('Error deleting tag:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
