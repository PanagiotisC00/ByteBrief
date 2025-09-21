// Robots.txt configuration for ByteBrief blog
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://bytebrief.vercel.app'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/blog/',
          '/news/',
          '/category/',
          '/about',
          '/contact',
        ],
        disallow: [
          '/admin/',
          '/api/',
          '/coming-soon',
          '/_next/',
          '/favicon.ico',
        ],
      },
      // Special rules for search engines
      {
        userAgent: ['Googlebot', 'Bingbot'],
        allow: '/',
        crawlDelay: 1,
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
