'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { NewsHeader, SortOption } from '@/components/news-header'
import { NewsGrid } from '@/components/news-grid'
import { NewsSidebar } from '@/components/news-sidebar'

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

type PopularPost = {
  id: string
  title: string
  slug: string
  viewCount: number
  readTime: number | null
  author: {
    name: string | null
    avatar: string | null
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
  trendingCategories: TrendingCategory[]
  popularPosts: PopularPost[]
  initialCategory: string
  initialSearch: string
}

export function NewsPageContent({
  categories,
  trendingCategories,
  popularPosts,
  initialCategory,
  initialSearch
}: NewsPageContentProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [posts, setPosts] = useState<NewsPost[]>([])
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>('date-desc')

  // Fetch posts when filters change
  useEffect(() => {
    fetchPosts()
  }, [selectedCategory, searchQuery])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()

      if (selectedCategory !== 'all') {
        params.set('category', selectedCategory)
      }

      if (searchQuery.trim() !== '') {
        params.set('search', searchQuery.trim())
      }

      const response = await fetch(`/api/news?${params.toString()}`)

      if (!response.ok) {
        throw new Error('Failed to fetch posts')
      }

      const fetchedPosts = await response.json()
      setPosts(fetchedPosts)
    } catch (error) {
      console.error('Failed to fetch posts:', error)
      setPosts([])
    } finally {
      setLoading(false)
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
    setSearchQuery(query)

    // Update URL params
    const params = new URLSearchParams(searchParams.toString())
    if (query.trim() === '') {
      params.delete('search')
    } else {
      params.set('search', query)
    }

    const url = params.toString() ? `/news?${params.toString()}` : '/news'
    router.push(url, { scroll: false })
  }

  const handleSortChange = (sort: SortOption) => {
    setSortBy(sort)
  }

  return (
    <>
      <NewsHeader
        categories={categories}
        onCategoryChange={handleCategoryChange}
        onSearchChange={handleSearchChange}
        onSortChange={handleSortChange}
        selectedCategory={selectedCategory}
        searchQuery={searchQuery}
        sortBy={sortBy}
      />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Show sidebar first on mobile, second on desktop */}
          <div className="lg:col-span-1 lg:order-2">
            <NewsSidebar
              trendingCategories={trendingCategories}
              popularPosts={popularPosts}
            />
          </div>
          {/* Show main content second on mobile, first on desktop */}
          <div className="lg:col-span-3 lg:order-1">
            {loading ? (
              <div className="text-center py-16">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-accent border-r-transparent"></div>
                <p className="mt-4 text-muted-foreground">Loading posts...</p>
              </div>
            ) : (
              <NewsGrid posts={sortedPosts} />
            )}
          </div>
        </div>
      </div>
    </>
  )
}

