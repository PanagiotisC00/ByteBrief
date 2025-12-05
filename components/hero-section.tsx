"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Clock, User } from "lucide-react"
import { FallbackImage } from "@/components/ui/fallback-image"
import Link from "next/link"

// Type for latest articles
type LatestArticle = {
  id: string
  title: string
  excerpt: string | null
  image: string | null
  slug: string
  readTime: number | null
  author: {
    name: string | null
    avatar: string | null
  }
  category: {
    name: string
    slug: string
    color: string | null
  }
}

interface HeroSectionProps {
  featuredArticles: LatestArticle[]
}

export function HeroSection({ featuredArticles }: HeroSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    if (featuredArticles.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % featuredArticles.length)
      }, 5000)
      return () => clearInterval(timer)
    }
  }, [featuredArticles.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredArticles.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredArticles.length) % featuredArticles.length)
  }

  // Handle empty articles
  if (!featuredArticles || featuredArticles.length === 0) {
    return (
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-card">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-balance leading-tight mb-4">
              Stay Ahead with{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">ByteBrief</span>
            </h1>
            <p className="text-xl text-muted-foreground text-pretty leading-relaxed mb-8">
              Your trusted source for cutting-edge technology news, in-depth analysis, and expert insights.
            </p>
            <p className="text-muted-foreground">
              No featured articles available. Check back soon for the latest tech insights!
            </p>
          </div>
        </div>
      </section>
    )
  }

  const currentArticle = featuredArticles[currentSlide]

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-card">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-accent/10 border border-accent/20">
                <span className="text-accent text-sm font-medium">Latest Tech Insights</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-balance leading-tight">
                Stay Ahead with{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">ByteBrief</span>
              </h1>
              <p className="text-xl text-muted-foreground text-pretty leading-relaxed">
                Your trusted source for cutting-edge technology news, in-depth analysis, and expert insights that matter
                to developers, entrepreneurs, and tech enthusiasts.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                asChild
                className="bg-primary hover:bg-primary/90 hover:scale-105 hover:shadow-lg transition-all duration-200 cursor-pointer transform"
              >
                <Link href="/news">
                  Explore Latest News
                </Link>
              </Button>
            </div>
          </div>

          {/* Featured Article Carousel */}
          <div className="relative">
            <Link href={`/blog/${currentArticle.slug}`} className="block">
              <Card className="overflow-hidden bg-card/50 backdrop-blur border-border/50 cursor-pointer hover:border-primary/50 transition-all duration-300">
                <div className="relative">
                  <FallbackImage
                    key={currentArticle.id}
                    src={currentArticle.image}
                    alt={currentArticle.title}
                    className="w-full h-64 object-contain bg-muted/50"
                  />
                  <div className="absolute top-4 left-4">
                    <span
                      className="px-3 py-1 text-white text-sm font-medium rounded-full"
                      style={{ backgroundColor: currentArticle.category.color || '#3B82F6' }}
                    >
                      {currentArticle.category.name}
                    </span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-card-foreground line-clamp-2 group-hover:text-accent transition-colors">{currentArticle.title}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-3">{currentArticle.excerpt}</p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{currentArticle.author.name || 'ByteBrief Team'}</span>
                        </div>
                        {currentArticle.readTime && (
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{currentArticle.readTime} min read</span>
                          </div>
                        )}
                      </div>
                      <span className="text-accent hover:underline">
                        Read More
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Carousel Controls */}
            <div className="flex items-center justify-between mt-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={prevSlide}
                className="text-muted-foreground hover:text-accent"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div className="flex space-x-2">
                {featuredArticles.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${index === currentSlide ? "bg-accent" : "bg-muted"
                      }`}
                  />
                ))}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={nextSlide}
                className="text-muted-foreground hover:text-accent"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
