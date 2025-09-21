// Blog data fetching utilities
import { prisma } from './prisma'
import { PostStatus } from '@prisma/client'

// Get published posts for public display
export async function getPublishedPosts(limit?: number) {
  return await prisma.post.findMany({
    where: {
      status: PostStatus.PUBLISHED
    },
    include: {
      author: {
        select: {
          name: true,
          avatar: true
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
              name: true,
              slug: true
            }
          }
        }
      }
    },
    orderBy: {
      publishedAt: 'desc'
    },
    take: limit
  })
}

// Get latest posts (renamed from getFeaturedPosts)
export async function getLatestPosts(limit = 3) {
  return await prisma.post.findMany({
    where: {
      status: PostStatus.PUBLISHED
    },
    include: {
      author: {
        select: {
          name: true,
          avatar: true
        }
      },
      category: {
        select: {
          name: true,
          slug: true,
          color: true
        }
      }
    },
    orderBy: {
      publishedAt: 'desc'
    },
    take: limit
  })
}

// Get post by slug
export async function getPostBySlug(slug: string) {
  const post = await prisma.post.findUnique({
    where: {
      slug,
      status: PostStatus.PUBLISHED
    },
    include: {
      author: {
        select: {
          name: true,
          avatar: true
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
              name: true,
              slug: true
            }
          }
        }
      },
      comments: {
        where: {
          status: 'APPROVED'
        },
        select: {
          id: true,
          content: true,
          author: true,
          createdAt: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  })

  // Increment view count
  if (post) {
    await prisma.post.update({
      where: { id: post.id },
      data: { viewCount: { increment: 1 } }
    })
  }

  return post
}

// Get posts by category
export async function getPostsByCategory(categorySlug: string, limit?: number) {
  return await prisma.post.findMany({
    where: {
      status: PostStatus.PUBLISHED,
      category: {
        slug: categorySlug
      }
    },
    include: {
      author: {
        select: {
          name: true,
          avatar: true
        }
      },
      category: {
        select: {
          name: true,
          slug: true,
          color: true
        }
      }
    },
    orderBy: {
      publishedAt: 'desc'
    },
    take: limit
  })
}

// Get all categories with post counts
export async function getCategories() {
  return await prisma.category.findMany({
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
    },
    orderBy: {
      name: 'asc'
    }
  })
}

// Get latest news/posts
export async function getLatestNews(limit = 6) {
  return await prisma.post.findMany({
    where: {
      status: PostStatus.PUBLISHED
    },
    include: {
      author: {
        select: {
          name: true,
          avatar: true
        }
      },
      category: {
        select: {
          name: true,
          slug: true,
          color: true
        }
      }
    },
    orderBy: {
      publishedAt: 'desc'
    },
    take: limit
  })
}

// Calculate estimated reading time
export function calculateReadTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

// Get all published posts for news page with optional filtering
export async function getNewsPosts(categorySlug?: string, searchQuery?: string) {
  const posts = await prisma.post.findMany({
    where: {
      status: PostStatus.PUBLISHED,
      ...(categorySlug && categorySlug !== 'all' ? {
        category: {
          slug: categorySlug,
        },
      } : {}),
      ...(searchQuery ? {
        OR: [
          {
            title: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
          {
            excerpt: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
          {
            content: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
        ],
      } : {}),
    },
    include: {
      author: {
        select: {
          name: true,
          avatar: true,
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
          tag: true,
        },
      },
    },
    orderBy: {
      publishedAt: 'desc',
    },
  })
  
  return posts
}

// Get trending categories (categories with most posts)
export async function getTrendingCategories(limit = 5) {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: {
          posts: {
            where: {
              status: PostStatus.PUBLISHED,
            },
          },
        },
      },
    },
    orderBy: {
      posts: {
        _count: 'desc',
      },
    },
    take: limit,
  })
  
  return categories
}

// Get popular posts (by view count)
export async function getPopularPosts(limit = 4) {
  const posts = await prisma.post.findMany({
    where: {
      status: PostStatus.PUBLISHED,
    },
    include: {
      author: {
        select: {
          name: true,
          avatar: true,
        },
      },
    },
    orderBy: {
      viewCount: 'desc',
    },
    take: limit,
  })
  
  return posts
}

// Get related posts (excluding current post)
export async function getRelatedPosts(categoryId: string, currentPostId: string, limit = 3) {
  const relatedPosts = await prisma.post.findMany({
    where: {
      categoryId,
      id: {
        not: currentPostId,
      },
      status: PostStatus.PUBLISHED,
    },
    include: {
      author: {
        select: {
          name: true,
          avatar: true,
        },
      },
      category: {
        select: {
          name: true,
          slug: true,
          color: true,
        },
      },
    },
    orderBy: {
      publishedAt: 'desc',
    },
    take: limit,
  })
  
  return relatedPosts
}

// Get single blog post by slug for individual post pages
export async function getBlogPost(slug: string) {
  const post = await prisma.post.findUnique({
    where: {
      slug,
      status: PostStatus.PUBLISHED,
    },
    include: {
      author: {
        select: {
          name: true,
          avatar: true,
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
              name: true,
              slug: true,
            },
          },
        },
      },
    },
  })

  // Increment view count
  if (post) {
    await prisma.post.update({
      where: { id: post.id },
      data: { viewCount: { increment: 1 } }
    })
  }

  return post
}

// Get category by slug
export async function getCategoryBySlug(slug: string) {
  return await prisma.category.findUnique({
    where: { slug },
    include: {
      _count: {
        select: {
          posts: {
            where: {
              status: PostStatus.PUBLISHED,
            },
          },
        },
      },
    },
  })
}

// Get posts by category slug
export async function getPostsByCategorySlug(categorySlug: string) {
  return await prisma.post.findMany({
    where: {
      status: PostStatus.PUBLISHED,
      category: {
        slug: categorySlug,
      },
    },
    include: {
      author: {
        select: {
          name: true,
          avatar: true,
        },
      },
      category: {
        select: {
          name: true,
          slug: true,
          color: true,
        },
      },
    },
    orderBy: {
      publishedAt: 'desc',
    },
  })
}

// Generate unique slug from title
export async function generateSlug(title: string, postId?: string): Promise<string> {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens

  let slug = baseSlug
  let counter = 1

  // Check for existing slug
  while (true) {
    const existingPost = await prisma.post.findFirst({
      where: {
        slug,
        ...(postId && { NOT: { id: postId } })
      }
    })

    if (!existingPost) break

    slug = `${baseSlug}-${counter}`
    counter++
  }

  return slug
}
