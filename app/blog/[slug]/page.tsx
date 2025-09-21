import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { prisma } from "@/lib/prisma"
import { FallbackImage } from "@/components/ui/fallback-image"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, Eye, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { notFound } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

// Get blog post by slug
async function getBlogPost(slug: string) {
  try {
    const post = await prisma.post.findUnique({
      where: { 
        slug,
        status: 'PUBLISHED' // Only show published posts
      },
      include: {
        author: {
          select: {
            name: true,
            avatar: true
          }
        },
        category: {
          select: {
            name: true,
            color: true,
            slug: true
          }
        },
        tags: {
          include: {
            tag: true
          }
        }
      }
    })

    if (!post) {
      return null
    }

    return {
      ...post,
      tags: post.tags.map(pt => pt.tag)
    }
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return null
  }
}

// Get related posts
async function getRelatedPosts(categoryId: string, currentPostId: string, limit = 3) {
  try {
    return await prisma.post.findMany({
      where: {
        categoryId,
        id: { not: currentPostId },
        status: 'PUBLISHED'
      },
      include: {
        author: {
          select: {
            name: true
          }
        },
        category: {
          select: {
            name: true,
            color: true
          }
        }
      },
      orderBy: {
        publishedAt: 'desc'
      },
      take: limit
    })
  } catch (error) {
    console.error('Error fetching related posts:', error)
    return []
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getBlogPost(params.slug)
  
  if (!post) {
    notFound()
  }

  const relatedPosts = await getRelatedPosts(post.categoryId, post.id)

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        {/* Back Button */}
        <div className="container mx-auto px-4 py-6">
          <Link href="/">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Article Header */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {/* Category Badge */}
              <div>
                <Badge 
                  className="text-white"
                  style={{ backgroundColor: post.category.color || '#3B82F6' }}
                >
                  {post.category.name}
                </Badge>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                {post.title}
              </h1>

              {/* Excerpt */}
              <p className="text-xl text-muted-foreground leading-relaxed">
                {post.excerpt}
              </p>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  <span>{post.author.name || 'ByteBrief Team'}</span>
                </div>
                {post.publishedAt && (
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>
                      {formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })}
                    </span>
                  </div>
                )}
                {post.readTime && (
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{post.readTime} min read</span>
                  </div>
                )}
                {post.viewCount && (
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-2" />
                    <span>{post.viewCount.toLocaleString()} views</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {post.image && (
          <div className="container mx-auto px-4 mb-12">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-center rounded-lg bg-muted/30 p-4">
                <FallbackImage
                  src={post.image}
                  alt={post.imageAlt || post.title}
                  className="max-w-full max-h-96 w-auto h-auto object-contain rounded-lg shadow-md"
                />
              </div>
            </div>
          </div>
        )}

        {/* Article Content */}
        <div className="container mx-auto px-4 pb-16">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
              {/* Convert markdown content to HTML here - for now showing as text */}
              <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                {post.content}
              </div>
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag.id} variant="secondary">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Sources */}
            {post.sources && (
              <div className="mt-8 pt-8 border-t border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Sources</h3>
                <div className="space-y-2">
                  {post.sources.split(',').map((source, index) => {
                    const trimmedSource = source.trim()
                    return trimmedSource && (
                      <div key={index} className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">{index + 1}.</span>
                        <a
                          href={trimmedSource}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:underline text-sm break-all"
                        >
                          {trimmedSource}
                        </a>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Articles Section */}
        {relatedPosts.length > 0 && (
          <div className="bg-card/30 border-t border-border">
            <div className="container mx-auto px-4 py-16">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-foreground mb-4">
                    <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      Related Articles
                    </span>
                  </h2>
                  <p className="text-muted-foreground">
                    More articles from the <strong>{post.category.name}</strong> category
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedPosts.map((relatedPost) => (
                    <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                      <Card className="group hover:shadow-lg transition-all duration-300 h-full">
                        <div className="relative overflow-hidden bg-muted/30">
                          <FallbackImage
                            src={relatedPost.image}
                            alt={relatedPost.title}
                            className="w-full h-40 object-contain group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-3 left-3">
                            <Badge 
                              variant="secondary" 
                              className="text-white text-xs"
                              style={{ backgroundColor: relatedPost.category.color || '#3B82F6' }}
                            >
                              {relatedPost.category.name}
                            </Badge>
                          </div>
                        </div>
                        <CardContent className="p-4 flex-grow">
                          <h3 className="font-semibold text-sm text-foreground group-hover:text-accent transition-colors line-clamp-2 mb-2">
                            {relatedPost.title}
                          </h3>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <User className="h-3 w-3 mr-1" />
                            <span>{relatedPost.author.name || 'ByteBrief Team'}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogPostPageProps) {
  const post = await getBlogPost(params.slug)
  
  if (!post) {
    return {
      title: 'Post Not Found - ByteBrief'
    }
  }

  return {
    title: `${post.title} - ByteBrief`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.image ? [post.image] : undefined,
    }
  }
}
