import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { LatestNews } from "@/components/latest-news"
import { TechCategories } from "@/components/tech-categories"
import { getLatestPosts, getLatestNews, getCategories } from "@/lib/blog"

export default async function HomePage() {
  // Clearance: fetch homepage data in parallel so the landing view renders faster
  const [latestPosts, latestNews, categories] = await Promise.all([
    getLatestPosts(3),
    getLatestNews(6),
    getCategories(),
  ])

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        <HeroSection featuredArticles={latestPosts} />
        {/* Clearance: show Latest News before Explore Categories for better homepage flow */}
        <LatestNews articles={latestNews} />
        <TechCategories categories={categories} />
      </main>
      <Footer />
    </div>
  )
}
