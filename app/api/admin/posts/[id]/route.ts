// API route for updating and deleting specific blog posts
import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getCurrentSession } from '@/lib/utils/auth'
import { prisma } from '@/lib/prisma'
import { generateSlug, calculateReadTime } from '@/lib/blog'

// Update existing post
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getCurrentSession()
    
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      title,
      excerpt,
      content,
      image,
      imageAlt,
      categoryId,
      sources,
      status,
      tags = []
    } = body

    // Validate required fields
    if (!title || !content || !categoryId) {
      return NextResponse.json(
        { error: 'Title, content, and category are required' },
        { status: 400 }
      )
    }

    // Check if post exists
    const existingPost = await prisma.post.findUnique({
      where: { id: params.id },
      include: { tags: true }
    })

    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Generate new slug if title changed
    const slug = title !== existingPost.title 
      ? await generateSlug(title, params.id)
      : existingPost.slug

    const readTime = calculateReadTime(content)

    // Delete existing tags relationships
    await prisma.postTag.deleteMany({
      where: { postId: params.id }
    })

    // Update the post
    const post = await prisma.post.update({
      where: { id: params.id },
      data: {
        title,
        slug,
        excerpt,
        content,
        image,
        imageAlt,
        sources,
        status,
        readTime,
        publishedAt: status === 'PUBLISHED' && !existingPost.publishedAt 
          ? new Date() 
          : existingPost.publishedAt,
        categoryId,
        // Recreate tag relationships
        tags: tags.length > 0 ? {
          create: tags.map((tagId: string) => ({
            tag: { connect: { id: tagId } }
          }))
        } : undefined
      },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        },
        category: {
          select: {
            name: true,
            slug: true,
            color: true
          }
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true
              }
            }
          }
        }
      }
    })

    // Revalidate relevant pages
    revalidatePath('/admin/posts')
    revalidatePath('/admin')
    revalidatePath('/')  // Homepage
    revalidatePath('/blog')
    revalidatePath(`/blog/${post.slug}`)
    revalidatePath('/news')

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    )
  }
}

// Delete post
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getCurrentSession()
    
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if post exists
    const existingPost = await prisma.post.findUnique({
      where: { id: params.id }
    })

    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Delete the post (tags and comments will be deleted due to cascade)
    await prisma.post.delete({
      where: { id: params.id }
    })

    // Revalidate relevant pages
    revalidatePath('/admin/posts')
    revalidatePath('/admin')
    revalidatePath('/')  // Homepage
    revalidatePath('/blog')
    revalidatePath('/news')

    return NextResponse.json({ message: 'Post deleted successfully' })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    )
  }
}
