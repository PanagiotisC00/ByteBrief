// API route for creating blog posts
import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { PostStatus } from '@prisma/client'
import { getCurrentSession } from '@/lib/utils/auth'
import { prisma } from '@/lib/prisma'
import { generateSlug, calculateReadTime } from '@/lib/blog'
import { formatZodError, postBodySchema } from '@/lib/validation/admin'

function revalidatePostPaths(
  slug: string,
  categorySlug?: string | null,
  tagSlugs: string[] = []
) {
  revalidatePath('/admin/posts')
  revalidatePath('/admin')
  revalidatePath('/')
  revalidatePath('/blog')
  revalidatePath('/news')
  revalidatePath(`/blog/${slug}`)

  if (categorySlug) {
    revalidatePath(`/category/${categorySlug}`)
  }

  for (const tagSlug of tagSlugs) {
    revalidatePath(`/tag/${tagSlug}`)
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
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

    const parsedBody = postBodySchema.safeParse(body)
    if (!parsedBody.success) {
      return NextResponse.json(formatZodError(parsedBody.error), { status: 400 })
    }

    const { title, excerpt, content, image, imageAlt, categoryId, sources, status, tags } = parsedBody.data

    const [category, existingTags] = await Promise.all([
      prisma.category.findUnique({
        where: { id: categoryId },
        select: { id: true, slug: true },
      }),
      tags.length > 0
        ? prisma.tag.findMany({
            where: { id: { in: tags } },
            select: { id: true, slug: true },
          })
        : Promise.resolve([]),
    ])

    if (!category) {
      return NextResponse.json({ error: 'Selected category does not exist' }, { status: 400 })
    }

    if (existingTags.length !== tags.length) {
      return NextResponse.json({ error: 'One or more selected tags are invalid' }, { status: 400 })
    }

    // Generate slug and calculate reading time
    const slug = await generateSlug(title)
    const readTime = calculateReadTime(content)

    // Create the post
    const post = await prisma.post.create({
      data: {
        title,
        slug,
        excerpt: excerpt ?? null,
        content,
        image: image ?? null,
        imageAlt: imageAlt ?? null,
        sources: sources ?? null,
        status,
        readTime,
        publishedAt: status === PostStatus.PUBLISHED ? new Date() : null,
        authorId: session.user.id,
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
                slug: true,
              }
            }
          }
        }
      }
    })

    revalidatePostPaths(
      post.slug,
      post.category.slug,
      post.tags.map(({ tag }) => tag.slug)
    )

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}
