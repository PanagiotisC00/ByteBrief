import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { NewsPageContent } from "@/components/news-page-content"
import { getCategories, getTrendingCategories, getPopularPosts } from "@/lib/blog"

export default async function NewsPage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string }
}) {
  // Fetch all required data
  const [categories, trendingCategories, popularPosts] = await Promise.all([
    getCategories(),
    getTrendingCategories(5),
    getPopularPosts(4)
  ])

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        <NewsPageContent 
          categories={categories}
          trendingCategories={trendingCategories}
          popularPosts={popularPosts}
          initialCategory={searchParams.category || 'all'}
          initialSearch={searchParams.search || ''}
        />
      </main>
      <Footer />
    </div>
  )
}
