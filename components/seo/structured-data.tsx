// Structured data components for SEO
import Script from 'next/script'

interface BlogWebsiteProps {
  url?: string
}

export function BlogWebsiteStructuredData({ url = 'https://bytebrief.vercel.app' }: BlogWebsiteProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "ByteBrief",
    "alternateName": "ByteBrief Blog",
    "description": "Modern tech news, insights, and analysis covering AI, web development, software development, and technology trends.",
    "url": url,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${url}/news?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "ByteBrief",
      "url": url,
      "logo": {
        "@type": "ImageObject",
        "url": `${url}/bytebrief-logo.png`,
        "width": 512,
        "height": 512
      },
      "sameAs": [
        `${url}/contact`
      ]
    }
  }

  return (
    <Script
      id="website-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

interface BlogPostProps {
  title: string
  description: string
  publishedAt: string
  updatedAt: string
  url: string
  imageUrl?: string
  authorName: string
  categoryName: string
  readTime?: number
}

export function BlogPostStructuredData({
  title,
  description,
  publishedAt,
  updatedAt,
  url,
  imageUrl,
  authorName,
  categoryName,
  readTime
}: BlogPostProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "description": description,
    "url": url,
    "datePublished": publishedAt,
    "dateModified": updatedAt,
    "author": {
      "@type": "Person",
      "name": authorName,
      "url": "https://bytebrief.vercel.app"
    },
    "publisher": {
      "@type": "Organization",
      "name": "ByteBrief",
      "url": "https://bytebrief.vercel.app",
      "logo": {
        "@type": "ImageObject",
        "url": "https://bytebrief.vercel.app/bytebrief-logo.png",
        "width": 512,
        "height": 512
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    },
    "articleSection": categoryName,
    ...(imageUrl && {
      "image": {
        "@type": "ImageObject",
        "url": imageUrl,
        "width": 1200,
        "height": 630
      }
    }),
    ...(readTime && {
      "timeRequired": `PT${readTime}M`
    })
  }

  return (
    <Script
      id="blog-post-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

interface BreadcrumbItem {
  name: string
  url: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export function BreadcrumbStructuredData({ items }: BreadcrumbProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  }

  return (
    <Script
      id="breadcrumb-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
