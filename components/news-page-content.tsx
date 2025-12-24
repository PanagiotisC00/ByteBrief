'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { NewsHeader, SortOption } from '@/components/news-header'
import { NewsGrid } from '@/components/news-grid'
import { Button } from '@/components/ui/button'

const PAGE_SIZE = 9 // Clearance: cap client fetches at 9 posts per page to mirror API

type Category = {
  id: string
  name: string
  slug: string
  color: string | null
  _count: {
    posts: number
  }
}

type TrendingCategory = {
  id: string
  name: string
  slug: string
  color: string | null
  _count: {
    posts: number
  }
}



type NewsPost = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  image: string | null
  imageAlt: string | null
  readTime: number | null
  publishedAt: Date | null
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

interface NewsPageContentProps {
  categories: Category[]
  initialCategory: string
  initialSearch: string
}

export function NewsPageContent({
  categories,
  initialCategory,
  initialSearch
}: NewsPageContentProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const fetchControllerRef = useRef<AbortController | null>(null)

  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [searchInput, setSearchInput] = useState(initialSearch)
  const [submittedSearch, setSubmittedSearch] = useState(initialSearch.trim())
  const [posts, setPosts] = useState<NewsPost[]>([])
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>('date-desc')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalPosts, setTotalPosts] = useState(0)

  // Fetch posts when filters change
  useEffect(() => {
    fetchPosts()
  }, [selectedCategory, submittedSearch, sortBy, page])

  const fetchPosts = async () => {
    // Cancel any in-flight request so we don't spam the server/DB with parallel queries
    fetchControllerRef.current?.abort()
    const controller = new AbortController()
    fetchControllerRef.current = controller
    setLoading(true)
    try {
      const params = new URLSearchParams()

      if (selectedCategory !== 'all') {
        params.set('category', selectedCategory)
      }

      if (submittedSearch !== '') {
        params.set('search', submittedSearch)
      }

      params.set('page', page.toString())
      params.set('pageSize', PAGE_SIZE.toString())
      params.set('sort', sortBy)

      const response = await fetch(`/api/news?${params.toString()}`, { signal: controller.signal })

      if (!response.ok) {
        throw new Error('Failed to fetch posts')
      }

      type NewsResponse = {
        posts: NewsPost[]
        page: number
        pageSize: number
        total: number
        totalPages: number
      }

      const data: NewsResponse = await response.json()
      setPosts(data.posts)
      setTotalPages(data.totalPages)
      setTotalPosts(data.total)
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return
      }
      console.error('Failed to fetch posts:', error)
      setPosts([])
      setTotalPages(1)
      setTotalPosts(0)
    } finally {
      if (fetchControllerRef.current === controller) {
        setLoading(false)
      }
    }
  }

  // Sort posts based on selected sort option
  const sortedPosts = useMemo(() => {
    const sorted = [...posts]

    switch (sortBy) {
      case 'date-desc':
        return sorted.sort((a, b) => {
          const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0
          const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0
          return dateB - dateA
        })
      case 'date-asc':
        return sorted.sort((a, b) => {
          const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0
          const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0
          return dateA - dateB
        })
      case 'topic':
        return sorted.sort((a, b) => {
          const catCompare = a.category.name.localeCompare(b.category.name)
          if (catCompare !== 0) return catCompare
          // Within same category, sort by date desc
          const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0
          const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0
          return dateB - dateA
        })
      default:
        return sorted
    }
  }, [posts, sortBy])

  const handleCategoryChange = (categorySlug: string) => {
    setSelectedCategory(categorySlug)
    setPage(1)

    // Update URL params
    const params = new URLSearchParams(searchParams.toString())
    if (categorySlug === 'all') {
      params.delete('category')
    } else {
      params.set('category', categorySlug)
    }

    const url = params.toString() ? `/news?${params.toString()}` : '/news'
    router.push(url, { scroll: false })
  }

  const handleSearchChange = (query: string) => {
    setSearchInput(query)
    // Clearance: keep input controlled but defer fetching until submit
  }

  const handleSearchSubmit = () => {
    // Clearance: only refresh results when the user intentionally submits
    const normalizedQuery = searchInput.trim()
    setPage(1)
    setSubmittedSearch(normalizedQuery)
  }

  const handleSortChange = (sort: SortOption) => {
    setSortBy(sort)
    setPage(1)
  }

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1)
    }
  }

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1)
    }
  }

  return (
    <>
      <NewsHeader
        categories={categories}
        onCategoryChange={handleCategoryChange}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
        onSortChange={handleSortChange}
        selectedCategory={selectedCategory}
        searchQuery={searchInput}
        sortBy={sortBy}
      />
      <div className="container mx-auto px-4 py-8">
        {/* Clearance: full-width content now that sidebar is removed */}
        <div className="grid grid-cols-1">
          <div className="lg:col-span-3 lg:order-1">
            {loading ? (
              <div className="text-center py-16">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-accent border-r-transparent"></div>
                <p className="mt-4 text-muted-foreground">Loading posts...</p>
              </div>
            ) : (
              <>
                <NewsGrid posts={sortedPosts} />
                <div className="mt-10 flex flex-col items-center space-y-3">
                  {totalPosts > 0 && (
                    <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-6">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white"
                        onClick={handlePreviousPage}
                        disabled={page === 1 || loading}
                      >
                        Previous
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        Page {page} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white"
                        onClick={handleNextPage}
                        disabled={page === totalPages || loading}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

