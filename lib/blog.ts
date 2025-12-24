// Blog data fetching utilities
import { prisma } from './prisma'
import { PostStatus } from '@prisma/client'

// Dedupe/caching to reduce concurrent Prisma load (important for pooler/serverless stability)
const CATEGORIES_CACHE_TTL_MS = 30_000
let categoriesCache: any[] | null = null
let categoriesCacheExpiresAt = 0
let categoriesPromise: Promise<any[]> | null = null

const newsPostsInFlight = new Map<string, Promise<any>>()

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

    }
  })

  // View count increment removed

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
  const now = Date.now()
  if (categoriesCache && now < categoriesCacheExpiresAt) {
    return categoriesCache
  }
  if (categoriesPromise) {
    return categoriesPromise
  }

  categoriesPromise = (async () => {
    try {
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
    } catch (error) {
      throw error
    }
  })()
    .then((res) => {
      categoriesCache = res
      categoriesCacheExpiresAt = Date.now() + CATEGORIES_CACHE_TTL_MS
      return res
    })
    .finally(() => {
      categoriesPromise = null
    })

  return categoriesPromise
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

const NEWS_PAGE_SIZE_MAX = 9

type GetNewsPostsSort = 'date-desc' | 'date-asc' | 'topic'

type GetNewsPostsOptions = {
  categorySlug?: string
  searchQuery?: string
  page?: number
  pageSize?: number
  sortBy?: GetNewsPostsSort
}

type NewsPostListItem = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  image: string | null
  imageAlt: string | null
  readTime: number | null
  publishedAt: Date | null
  updatedAt: Date | null
  author: {
    name: string | null
    avatar: string | null
  }
  category: {
    name: string
    slug: string
    color: string | null
  }
  tags: {
    tag: {
      id: string
      name: string
      slug: string
    }
  }[]
}

type GetNewsPostsResult = {
  posts: NewsPostListItem[]
  total: number
}

// Clearance: enforce pagination + skinny selects so /news stays quick
export async function getNewsPosts({
  categorySlug,
  searchQuery,
  page = 1,
  pageSize = NEWS_PAGE_SIZE_MAX,
  sortBy = 'date-desc',
}: GetNewsPostsOptions = {}): Promise<GetNewsPostsResult> {
  const normalizedSearch = searchQuery?.trim() ?? ''
  // Clearance: split search into tokens so any word can match
  const searchTokens = normalizedSearch.length > 0 ? normalizedSearch.split(/\s+/) : []
  const normalizedPage = Number.isFinite(page) ? Math.max(1, Math.floor(page)) : 1
  const normalizedPageSize = Number.isFinite(pageSize)
    ? Math.max(1, Math.min(Math.floor(pageSize), NEWS_PAGE_SIZE_MAX))
    : NEWS_PAGE_SIZE_MAX
  const sortOption: GetNewsPostsSort = sortBy ?? 'date-desc'

  const key = [
    categorySlug ?? '',
    normalizedSearch,
    normalizedPage,
    normalizedPageSize,
    sortOption,
  ].join('|')
  const existing = newsPostsInFlight.get(key)
  if (existing) return existing

  const promise = (async () => {
    try {
      const where = {
        status: PostStatus.PUBLISHED,
        ...(categorySlug && categorySlug !== 'all'
          ? {
              category: {
                slug: categorySlug,
              },
            }
          : {}),
        ...(searchTokens.length
          ? {
              OR: searchTokens.map((token) => ({
                OR: [
                  {
                    title: {
                      contains: token,
                      mode: 'insensitive',
                    },
                  },
                  {
                    excerpt: {
                      contains: token,
                      mode: 'insensitive',
                    },
                  },
                  {
                    content: {
                      contains: token,
                      mode: 'insensitive',
                    },
                  },
                ],
              })),
            }
          : {}),
      }

      const orderBy =
        sortOption === 'topic'
          ? [
              {
                category: {
                  name: 'asc' as const,
                },
              },
              {
                publishedAt: 'desc' as const,
              },
            ]
          : [
              {
                publishedAt: (sortOption === 'date-asc' ? 'asc' : 'desc') as const,
              },
            ]

      const [posts, total] = await Promise.all([
        prisma.post.findMany({
          where,
          select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            image: true,
            imageAlt: true,
            readTime: true,
            publishedAt: true,
            updatedAt: true,
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
                    id: true,
                    name: true,
                    slug: true,
                  },
                },
              },
            },
          },
          orderBy,
          skip: (normalizedPage - 1) * normalizedPageSize,
          take: normalizedPageSize,
        }),
        prisma.post.count({
          where,
        }),
      ])

      return { posts, total }
    } finally {
      newsPostsInFlight.delete(key)
    }
  })()

  newsPostsInFlight.set(key, promise)
  return promise
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

  // View count increment removed

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
