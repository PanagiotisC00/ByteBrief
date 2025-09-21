import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getCurrentSession } from '@/lib/utils/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getCurrentSession()
    
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, slug } = body

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      )
    }

    // Check if tag exists
    const existingTag = await prisma.tag.findUnique({
      where: { id: params.id }
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
        slug,
        NOT: { id: params.id }
      }
    })

    if (slugConflict) {
      return NextResponse.json(
        { error: 'A tag with this name already exists' },
        { status: 400 }
      )
    }

    // Update the tag
    const tag = await prisma.tag.update({
      where: { id: params.id },
      data: {
        name,
        slug
      }
    })

    // Revalidate relevant pages
    revalidatePath('/admin/tags')
    revalidatePath('/admin')

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
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getCurrentSession()
    
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if tag exists and has posts
    const tag = await prisma.tag.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            posts: {
              where: {
                post: {
                  status: 'PUBLISHED'
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
      where: { id: params.id }
    })

    // Revalidate relevant pages
    revalidatePath('/admin/tags')
    revalidatePath('/admin')

    return NextResponse.json({ message: 'Tag deleted successfully' })
  } catch (error) {
    console.error('Error deleting tag:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
