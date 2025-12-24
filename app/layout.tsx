import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { Toaster } from "sonner"
import { BlogWebsiteStructuredData } from "@/components/seo/structured-data"
import { NavigationFeedbackProvider } from "@/components/providers/navigation-feedback-provider"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "ByteBrief - Modern Tech News & Insights",
    template: "%s | ByteBrief"
  },
  description: "Stay ahead with the latest tech news, reviews, and insights from ByteBrief - your source for modern technology updates, AI developments, web development, and industry analysis.",
  keywords: [
    "tech news",
    "technology blog", 
    "AI news",
    "web development",
    "software development",
    "tech insights",
    "technology reviews",
    "programming",
    "ByteBrief"
  ],
  authors: [{ name: "Panagiotis Chrysanthou", url: "https://bytebrief.vercel.app" }],
  creator: "Panagiotis Chrysanthou",
  publisher: "ByteBrief",
  category: "Technology",
  classification: "Technology News and Insights",
  
  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://bytebrief.vercel.app',
    siteName: 'ByteBrief',
    title: 'ByteBrief - Modern Tech News & Insights',
    description: 'Stay ahead with the latest tech news, reviews, and insights from ByteBrief - your source for modern technology updates.',
    images: [
      {
        url: 'https://bytebrief.vercel.app/bytebrief-logo.png',
        width: 1200,
        height: 630,
        alt: 'ByteBrief - Modern Tech News & Insights',
      }
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'ByteBrief - Modern Tech News & Insights',
    description: 'Stay ahead with the latest tech news, reviews, and insights from ByteBrief.',
    images: ['https://bytebrief.vercel.app/bytebrief-logo.png'],
    creator: '@bytebrief',
    site: '@bytebrief',
  },

  // Favicon and PWA icons
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
  },

  // PWA manifest
  manifest: '/site.webmanifest',
  
  // Additional PWA and SEO metadata  
  applicationName: 'ByteBrief',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ByteBrief',
  },
  formatDetection: {
    telephone: false,
  },

  // Technical SEO
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Google Search Console verification
  verification: {
    google: 'a422aa713566884b',
    // yandex: 'your-yandex-verification-code',
    // yahoo: 'your-yahoo-verification-code',
  },

  // Additional metadata
  alternates: {
    canonical: 'https://bytebrief.vercel.app',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <NavigationFeedbackProvider>
          <Suspense fallback={null}>{children}</Suspense>
          <Toaster theme="dark" />
          <Analytics />
          <BlogWebsiteStructuredData />
        </NavigationFeedbackProvider>
      </body>
    </html>
  )
}
