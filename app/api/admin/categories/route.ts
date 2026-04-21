import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getCurrentSession } from '@/lib/utils/auth'
import { prisma } from '@/lib/prisma'
import { categoryBodySchema, formatZodError } from '@/lib/validation/admin'

export async function POST(request: NextRequest) {
  try {
    const session = await getCurrentSession()
    
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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

    const { name, slug, description, color, icon } = parsedBody.data

    const existingCategory = await prisma.category.findFirst({
      where: {
        OR: [
          { name },
          { slug },
        ],
      },
    })

    if (existingCategory) {
      return NextResponse.json(
        { error: existingCategory.slug === slug ? 'A category with this slug already exists' : 'A category with this name already exists' },
        { status: 400 }
      )
    }

    // Create the category
    const category = await prisma.category.create({
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

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
