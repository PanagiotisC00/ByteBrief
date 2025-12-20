import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { LatestNews } from "@/components/latest-news"
import { TechCategories } from "@/components/tech-categories"
import { getLatestPosts, getLatestNews, getCategories } from "@/lib/blog"

export default async function HomePage() {
  // Clearance: avoid parallel Prisma queries on serverless to reduce connection pool contention
  const latestPosts = await getLatestPosts(3)
  const latestNews = await getLatestNews(6)
  const categories = await getCategories()

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        <HeroSection featuredArticles={latestPosts} />
        <TechCategories categories={categories} />
        <LatestNews articles={latestNews} />
      </main>
      <Footer />
    </div>
  )
}
