// API route for creating blog posts
import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getCurrentSession } from '@/lib/utils/auth'
import { prisma } from '@/lib/prisma'
import { generateSlug, calculateReadTime } from '@/lib/blog'

export async function POST(request: NextRequest) {
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
      authorId,
      tags = []
    } = body

    // Validate required fields
    if (!title || !content || !categoryId) {
      return NextResponse.json(
        { error: 'Title, content, and category are required' },
        { status: 400 }
      )
    }

    // Generate slug and calculate reading time
    const slug = await generateSlug(title)
    const readTime = calculateReadTime(content)

    // Create the post
    const post = await prisma.post.create({
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
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
        authorId,
        categoryId,
        // Connect tags if provided
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
    if (status === 'PUBLISHED') {
      revalidatePath('/blog')
      revalidatePath(`/blog/${slug}`)
      revalidatePath('/news')
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}
