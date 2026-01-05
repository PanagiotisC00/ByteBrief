// Admin posts management page
import { requireAdmin } from '@/lib/utils/auth'
import { prisma } from '@/lib/prisma'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PostsTable } from '@/components/admin/posts-table'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from '@/components/ui/pagination'
import { LoadingLink } from '@/components/ui/loading-link'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight, PlusCircle, Search } from 'lucide-react'
import Link from 'next/link'
import type { Prisma } from '@prisma/client'

const PAGE_SIZE = 9
const CACHE_TTL_MS = 30_000
const postsCache = new Map<string, { posts: Awaited<ReturnType<typeof queryPosts>>; expiresAt: number }>()
const countCache = new Map<string, { total: number; expiresAt: number }>()

const getPaginationItems = (currentPage: number, totalPages: number) => {
  const delta = 2
  const range: number[] = []
  for (let i = 1; i <= totalPages; i += 1) {
    if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
      range.push(i)
    }
  }

  const items: Array<number | 'ellipsis'> = []
  let last = 0
  for (const page of range) {
    if (page - last > 1) {
      items.push('ellipsis')
    }
    items.push(page)
    last = page
  }
  return items
}

async function queryPosts(page: number, where?: Prisma.PostWhereInput) {
  const skip = (page - 1) * PAGE_SIZE
  return await prisma.post.findMany({
    take: PAGE_SIZE,
    skip,
    where,
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
          color: true
        }
      },

    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}

async function getPostsCached(page: number, where: Prisma.PostWhereInput | undefined, cacheKey: string) {
  const cached = postsCache.get(cacheKey)
  if (cached && cached.expiresAt > Date.now()) {
    return cached.posts
  }
  const posts = await queryPosts(page, where)
  postsCache.set(cacheKey, { posts, expiresAt: Date.now() + CACHE_TTL_MS })
  return posts
}

async function getCountCached(where: Prisma.PostWhereInput | undefined, cacheKey: string) {
  const cached = countCache.get(cacheKey)
  if (cached && cached.expiresAt > Date.now()) {
    return cached.total
  }
  const total = await prisma.post.count({ where })
  countCache.set(cacheKey, { total, expiresAt: Date.now() + CACHE_TTL_MS })
  return total
}

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams?: { page?: string | string[]; query?: string | string[] }
}) {
  await requireAdmin()
  const pageParam = searchParams?.page ?? '1'
  const parsedPage = Number.parseInt(Array.isArray(pageParam) ? pageParam[0] : pageParam, 10)
  const requestedPage = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1
  const queryParam = searchParams?.query ?? ''
  const rawQuery = Array.isArray(queryParam) ? queryParam[0] : queryParam
  const normalizedQuery = rawQuery?.trim() ?? ''
  const where: Prisma.PostWhereInput | undefined = normalizedQuery
    ? {
        OR: [
          { title: { contains: normalizedQuery, mode: 'insensitive' } },
          { slug: { contains: normalizedQuery, mode: 'insensitive' } },
          { excerpt: { contains: normalizedQuery, mode: 'insensitive' } },
          { content: { contains: normalizedQuery, mode: 'insensitive' } },
        ],
      }
    : undefined

  const cacheKey = normalizedQuery || 'all'
  const totalPosts = await getCountCached(where, cacheKey)
  const totalPages = Math.max(1, Math.ceil(totalPosts / PAGE_SIZE))
  const currentPage = Math.min(requestedPage, totalPages)
  const posts = await getPostsCached(currentPage, where, `${cacheKey}|${currentPage}`)
  const paginationItems = totalPages > 1 ? getPaginationItems(currentPage, totalPages) : []

  const buildHref = (page: number) => {
    const params = new URLSearchParams()
    if (normalizedQuery) {
      params.set('query', normalizedQuery)
    }
    params.set('page', page.toString())
    return `/admin/posts?${params.toString()}`
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Posts Management</h1>
          <p className="text-muted-foreground mt-2">Create, edit, and manage your blog posts</p>
        </div>
        <Button asChild className="bg-primary text-primary-foreground hover:bg-[#7fffc1] hover:text-[#0f1f16]">
          <Link href="/admin/posts/new">
            <PlusCircle className="h-4 w-4 mr-2" />
            New Post
          </Link>
        </Button>
      </div>

      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <form action="/admin/posts" method="get" className="flex w-full max-w-xl items-center gap-2">
          <div className="relative w-full">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              key={normalizedQuery || 'empty'}
              name="query"
              defaultValue={normalizedQuery}
              placeholder="Search posts by title, excerpt, slug, or content..."
              className="pl-8"
              aria-label="Search posts"
            />
          </div>
          <Button
            type="submit"
            className="bg-primary text-primary-foreground hover:bg-[#7fffc1] hover:text-[#0f1f16]"
          >
            Search
          </Button>
          {normalizedQuery ? (
            <LoadingLink
              href="/admin/posts"
              loadingLabel="Loading posts."
              className={cn(
                buttonVariants({ variant: 'ghost' }),
                '!bg-primary !text-primary-foreground !border-transparent hover:!bg-[#7fffc1] hover:!text-[#0f1f16]'
              )}
            >
              Clear
            </LoadingLink>
          ) : null}
        </form>
        <p className="text-xs text-muted-foreground">
          {totalPosts} result{totalPosts === 1 ? '' : 's'}
        </p>
      </div>

      <PostsTable posts={posts} />

      {totalPages > 1 && (
        <div className="mt-6 flex flex-col items-center gap-3">
          <p className="text-xs text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                {currentPage > 1 ? (
                  <LoadingLink
                    href={buildHref(currentPage - 1)}
                    loadingLabel="Loading posts."
                    className={cn(
                      buttonVariants({ variant: 'ghost', size: 'default' }),
                      'gap-1 px-2.5 sm:pl-2.5 !bg-primary !text-primary-foreground !border-transparent hover:!bg-[#7fffc1] hover:!text-[#0f1f16]'
                    )}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:block">Previous</span>
                  </LoadingLink>
                ) : (
                  <span
                    className={cn(
                      buttonVariants({ variant: 'ghost', size: 'default' }),
                      'gap-1 px-2.5 sm:pl-2.5 pointer-events-none opacity-50 !bg-primary !text-primary-foreground !border-transparent'
                    )}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:block">Previous</span>
                  </span>
                )}
              </PaginationItem>
              {paginationItems.map((item, index) => (
                <PaginationItem key={`${item}-${index}`}>
                  {item === 'ellipsis' ? (
                    <PaginationEllipsis />
                  ) : (
                    <LoadingLink
                      href={buildHref(item)}
                      loadingLabel="Loading posts."
                      className={cn(
                        buttonVariants({ variant: item === currentPage ? 'outline' : 'ghost', size: 'icon' }),
                        '!size-8 !rounded-full',
                        item === currentPage
                          ? '!bg-[#7fffc1] !text-[#0f1f16] !border-transparent'
                          : '!bg-primary !text-primary-foreground !border-transparent hover:!bg-[#7fffc1] hover:!text-[#0f1f16]'
                      )}
                      aria-current={item === currentPage ? 'page' : undefined}
                    >
                      {item}
                    </LoadingLink>
                  )}
                </PaginationItem>
              ))}
              <PaginationItem>
                {currentPage < totalPages ? (
                  <LoadingLink
                    href={buildHref(currentPage + 1)}
                    loadingLabel="Loading posts."
                    className={cn(
                      buttonVariants({ variant: 'ghost', size: 'default' }),
                      'gap-1 px-2.5 sm:pr-2.5 !bg-primary !text-primary-foreground !border-transparent hover:!bg-[#7fffc1] hover:!text-[#0f1f16]'
                    )}
                  >
                    <span className="hidden sm:block">Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </LoadingLink>
                ) : (
                  <span
                    className={cn(
                      buttonVariants({ variant: 'ghost', size: 'default' }),
                      'gap-1 px-2.5 sm:pr-2.5 pointer-events-none opacity-50 !bg-primary !text-primary-foreground !border-transparent'
                    )}
                  >
                    <span className="hidden sm:block">Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </span>
                )}
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}
