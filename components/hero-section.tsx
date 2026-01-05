"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Clock, User, Calendar } from "lucide-react"
import { LoadingLink } from "@/components/ui/loading-link"
import { format } from "date-fns"
import { AnimatePresence, m, type Variants } from "framer-motion"
import { HeroMotionProvider } from "@/components/hero/hero-motion"
import { CircuitBackdrop } from "@/components/hero/circuit-backdrop"
import { CyberCube } from "@/components/hero/cyber-cube"

// Clearance: Optimized image component for Hero to prevent layout shift and mobile lag
function HeroImage({ src, alt, className }: { src: string | null; alt: string; className?: string }) {
  const [imgSrc, setImgSrc] = useState(src || "/bytebrief-logo.png")
  
  return (
    <div className={`relative ${className}`}>
      <Image
        src={imgSrc}
        alt={alt}
        fill
        className="object-contain"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority
        onError={() => setImgSrc("/bytebrief-logo.png")}
      />
    </div>
  )
}

// Clearance: orchestrated hero entrance animations are isolated to the hero to keep the rest of the site unaffected.
const heroContainerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
}

const heroItemVariants: Variants = {
  hidden: { opacity: 0, y: 12, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 260, damping: 30, mass: 0.9 },
  },
}

const heroCardVariants: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.985 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 220, damping: 26, mass: 0.95 },
  },
}

// Type for latest articles
type LatestArticle = {
  id: string
  title: string
  excerpt: string | null
  image: string | null
  slug: string
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
}

interface HeroSectionProps {
  featuredArticles: LatestArticle[]
}

export function HeroSection({ featuredArticles }: HeroSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (featuredArticles.length > 0 && !isPaused) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % featuredArticles.length)
      }, 5000)
      return () => clearInterval(timer)
    }
  }, [featuredArticles.length, isPaused])

  const pauseAutoScroll = () => {
    setIsPaused(true)
    // Resume auto-scroll after 10 seconds
    setTimeout(() => setIsPaused(false), 10000)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredArticles.length)
    pauseAutoScroll()
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredArticles.length) % featuredArticles.length)
    pauseAutoScroll()
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
    <HeroMotionProvider>
      <m.section
        // Clearance: isolate stacking context so animated backdrops render above the section background (no negative z-index surprises).
        className="relative isolate overflow-hidden bg-gradient-to-br from-background via-background to-card"
        variants={heroContainerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Background layers */}
        <div className="pointer-events-none absolute inset-0 z-0">
          {/* Clearance: soft wash sits behind the circuits so traces stay visible. */}
          <div className="absolute inset-0 bg-gradient-to-br from-background/55 via-background/20 to-card/45" />
          <div className="absolute -top-32 left-[-120px] h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute -bottom-40 right-[-140px] h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
          <CircuitBackdrop className="absolute inset-0 opacity-100" />
        </div>

        <div className="container relative z-10 mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <m.div className="space-y-8" variants={heroItemVariants}>
              <div className="space-y-4">
                <m.div
                  variants={heroItemVariants}
                  className="inline-flex items-center px-3 py-1 rounded-full bg-accent/10 border border-accent/20"
                >
                  <span className="text-accent text-sm font-medium">Latest Tech Insights</span>
                </m.div>
                <m.h1
                  variants={heroItemVariants}
                  className="text-4xl md:text-6xl font-bold text-balance leading-tight"
                >
                  Stay Ahead with{" "}
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">ByteBrief</span>
                  {/* Clearance: rhombus after ByteBrief on desktop, shown below title on mobile. */}
                  <CyberCube size="sm" className="pointer-events-none hidden md:inline-flex opacity-95 ml-3 align-middle" />
                </m.h1>
                
                {/* Clearance: rhombus centered below title on mobile only */}
                <div className="flex justify-center md:hidden mt-6">
                  <CyberCube size="sm" className="pointer-events-none opacity-95" />
                </div>
                
                <m.p variants={heroItemVariants} className="text-xl text-muted-foreground text-pretty leading-relaxed">
                  Your trusted source for cutting-edge technology news, in-depth analysis, and expert insights that matter
                  to developers, entrepreneurs, and tech enthusiasts.
                </m.p>
              </div>
              <m.div variants={heroItemVariants} className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  asChild
                  className="bg-primary hover:bg-primary/90 hover:scale-105 hover:shadow-lg transition-all duration-200 cursor-pointer transform"
                >
                  <LoadingLink href="/news" loadingLabel="Loading news feed…">
                    Explore Latest News
                  </LoadingLink>
                </Button>
              </m.div>
            </m.div>

            {/* Featured Article Carousel */}
            <m.div className="relative" variants={heroCardVariants}>
              {/* Clearance: use AnimatePresence so carousel slide changes feel polished without extra client state. */}
              <AnimatePresence initial={false} mode="wait">
                <m.div
                  key={currentArticle.id}
                  initial={{ opacity: 0, y: 12, scale: 0.99 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.99 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <LoadingLink href={`/blog/${currentArticle.slug}`} className="block" loadingLabel="Loading article…">
                    {/* Clearance: reduce transparency and remove blur on mobile for better performance */}
                    <Card className="overflow-hidden bg-card/95 md:bg-card/50 md:backdrop-blur border-border/50 cursor-pointer hover:border-primary/50 transition-all duration-300">
                      <div className="relative">
                        <HeroImage
                          src={currentArticle.image}
                          alt={currentArticle.title}
                          className="w-full h-64 bg-muted/50"
                        />
                        <div className="absolute top-4 left-4">
                          <span
                            className="px-3 py-1 text-white text-sm font-medium rounded-full"
                            style={{ backgroundColor: currentArticle.category.color || "#3B82F6" }}
                          >
                            {currentArticle.category.name}
                          </span>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <h3 className="text-xl font-bold text-card-foreground line-clamp-2 group-hover:text-accent transition-colors">
                            {currentArticle.title}
                          </h3>
                          <p className="text-muted-foreground text-sm line-clamp-3">{currentArticle.excerpt}</p>
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-1">
                                <User className="h-4 w-4" />
                                <span>{currentArticle.author.name || "ByteBrief Team"}</span>
                              </div>
                              {currentArticle.readTime && (
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{currentArticle.readTime}m</span>
                                </div>
                              )}
                              {currentArticle.publishedAt && (
                                <div className="flex items-center space-x-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>{format(new Date(currentArticle.publishedAt), "dd/MM/yyyy")}</span>
                                </div>
                              )}
                            </div>
                            <span className="text-accent hover:underline">Read More</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </LoadingLink>
                </m.div>
              </AnimatePresence>

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
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentSlide ? "bg-accent" : "bg-muted"
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
            </m.div>
          </div>
        </div>
      </m.section>
    </HeroMotionProvider>
  )
}
