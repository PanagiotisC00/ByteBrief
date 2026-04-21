// API route for updating and deleting specific blog posts
import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { PostStatus } from '@prisma/client'
import { getCurrentSession } from '@/lib/utils/auth'
import { prisma } from '@/lib/prisma'
import { generateSlug, calculateReadTime } from '@/lib/blog'
import { adminIdParamsSchema, formatZodError, postBodySchema } from '@/lib/validation/admin'

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

// Update existing post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getCurrentSession()
    
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const parsedParams = adminIdParamsSchema.safeParse(await params)
    if (!parsedParams.success) {
      return NextResponse.json({ error: 'Invalid post id' }, { status: 400 })
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

    const { id } = parsedParams.data
    const { title, excerpt, content, image, imageAlt, categoryId, sources, status, tags } = parsedBody.data

    const existingPost = await prisma.post.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            slug: true,
          },
        },
        tags: {
          include: {
            tag: {
              select: {
                slug: true,
              },
            },
          },
        },
      },
    })

    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

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

    // Generate new slug if title changed
    const oldSlug = existingPost.slug
    const previousCategorySlug = existingPost.category.slug
    const previousTagSlugs = existingPost.tags.map(({ tag }) => tag.slug)
    const slug = title !== existingPost.title 
      ? await generateSlug(title, id)
      : existingPost.slug

    const readTime = calculateReadTime(content)

    const post = await prisma.$transaction(async (tx) => {
      return tx.post.update({
        where: { id },
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
          publishedAt: status === PostStatus.PUBLISHED && !existingPost.publishedAt
            ? new Date()
            : existingPost.publishedAt,
          categoryId,
          tags: {
            deleteMany: {},
            ...(tags.length > 0
              ? {
                  create: tags.map((tagId: string) => ({
                    tag: { connect: { id: tagId } },
                  })),
                }
              : {}),
          },
        },
        include: {
          author: {
            select: {
              name: true,
              email: true,
            },
          },
          category: {
            select: {
              name: true,
              slug: true,
              color: true,
            },
          },
          tags: {
            include: {
              tag: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
        },
      })
    })

    revalidatePostPaths(
      post.slug,
      post.category.slug,
      post.tags.map(({ tag }) => tag.slug)
    )
    if (oldSlug !== post.slug) {
      revalidatePath(`/blog/${oldSlug}`)
    }
    if (previousCategorySlug !== post.category.slug) {
      revalidatePath(`/category/${previousCategorySlug}`)
    }
    for (const tagSlug of previousTagSlugs) {
      if (!post.tags.some(({ tag }) => tag.slug === tagSlug)) {
        revalidatePath(`/tag/${tagSlug}`)
      }
    }

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
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getCurrentSession()
    
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const parsedParams = adminIdParamsSchema.safeParse(await params)
    if (!parsedParams.success) {
      return NextResponse.json({ error: 'Invalid post id' }, { status: 400 })
    }

    const { id } = parsedParams.data

    // Check if post exists
    const existingPost = await prisma.post.findUnique({
      where: { id },
      select: {
        id: true,
        slug: true,
        category: {
          select: {
            slug: true,
          },
        },
        tags: {
          include: {
            tag: {
              select: {
                slug: true,
              },
            },
          },
        },
      },
    })

    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Delete the post (tags and comments will be deleted due to cascade)
    await prisma.post.delete({
      where: { id }
    })

    revalidatePostPaths(
      existingPost.slug,
      existingPost.category.slug,
      existingPost.tags.map(({ tag }) => tag.slug)
    )

    return NextResponse.json({ message: 'Post deleted successfully' })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    )
  }
}
