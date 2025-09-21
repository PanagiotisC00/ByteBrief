import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { NewsPageContent } from "@/components/news-page-content"
import { getCategories, getTrendingCategories, getPopularPosts } from "@/lib/blog"
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tech News - Latest Technology Updates & Breaking News',
  description: 'Stay updated with the latest tech news, breaking technology updates, industry insights, and trending topics in AI, web development, software engineering, and more.',
  keywords: [
    'tech news',
    'technology news',
    'breaking tech news',
    'AI news',
    'software news',
    'web development news',
    'technology updates',
    'ByteBrief news'
  ],
  openGraph: {
    title: 'ByteBrief Tech News - Latest Technology Updates',
    description: 'Stay updated with the latest tech news, breaking technology updates, and industry insights.',
    url: 'https://bytebrief.vercel.app/news',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ByteBrief Tech News - Latest Technology Updates',
    description: 'Stay updated with breaking tech news and technology insights.',
  },
  alternates: {
    canonical: 'https://bytebrief.vercel.app/news',
  },
}

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
