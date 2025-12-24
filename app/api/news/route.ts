import { NextRequest, NextResponse } from 'next/server'
import { getNewsPosts } from '@/lib/blog'

const DEFAULT_PAGE_SIZE = 9

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || undefined
    const rawSearch = searchParams.get('search')
    // Clearance: trim whitespace-only queries so caching and pagination stay consistent
    const normalizedSearch = rawSearch?.trim() ?? ''
    const search = normalizedSearch === '' ? undefined : normalizedSearch
    const pageParam = Number(searchParams.get('page') ?? '1')
    const pageSizeParam = Number(searchParams.get('pageSize') ?? `${DEFAULT_PAGE_SIZE}`)
    const sortParam = searchParams.get('sort')

    const page = Number.isFinite(pageParam) ? Math.max(1, Math.floor(pageParam)) : 1
    const pageSize = Number.isFinite(pageSizeParam)
      ? Math.max(1, Math.min(Math.floor(pageSizeParam), DEFAULT_PAGE_SIZE))
      : DEFAULT_PAGE_SIZE
    const sortBy = (sortParam as 'date-desc' | 'date-asc' | 'topic' | null) ?? 'date-desc'

    // Clearance: keep responses capped at 9 posts for predictable latency
    const { posts, total } = await getNewsPosts({
      categorySlug: category === 'all' ? undefined : category,
      searchQuery: search,
      page,
      pageSize,
      sortBy,
    })

    const totalPages = Math.max(1, Math.ceil(total / pageSize))

    return NextResponse.json({
      posts,
      page,
      pageSize,
      total,
      totalPages,
    })
  } catch (error) {
    console.error('Failed to fetch news posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}
