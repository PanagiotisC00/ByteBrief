// Dynamic sitemap generation for ByteBrief blog
import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://bytebrief.vercel.app'
  const currentDate = new Date().toISOString()

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: currentDate,
      changeFrequency: 'hourly',
      priority: 0.9,
    },
  ]

  try {
    // Dynamic blog posts
    const posts = await prisma.post.findMany({
      where: {
        status: 'PUBLISHED'
      },
      select: {
        slug: true,
        updatedAt: true,
        publishedAt: true,
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    const postRoutes: MetadataRoute.Sitemap = posts.map((post: any) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt.toISOString(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }))

    // Dynamic categories
    const categories = await prisma.category.findMany({
      select: {
        slug: true,
        updatedAt: true,
      }
    })

    const categoryRoutes: MetadataRoute.Sitemap = categories.map((category: any) => ({
      url: `${baseUrl}/category/${category.slug}`,
      lastModified: category.updatedAt.toISOString(),
      changeFrequency: 'weekly',
      priority: 0.6,
    }))

    return [...staticRoutes, ...postRoutes, ...categoryRoutes]

  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Return at least static routes if database fails
    return staticRoutes
  }
}
