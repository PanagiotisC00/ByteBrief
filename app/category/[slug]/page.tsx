import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { prisma } from "@/lib/prisma"
import { FallbackImage } from "@/components/ui/fallback-image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Calendar, Clock, User, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LoadingLink } from "@/components/ui/loading-link"
import { formatDistanceToNow } from "date-fns"
import { notFound } from "next/navigation"

interface CategoryPageProps {
  params: {
    slug: string
  }
}

// Clearance: select only listing fields to avoid shipping heavy content blobs
async function getCategoryWithPosts(slug: string) {
  try {
    return await prisma.category.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        color: true,
        posts: {
          where: {
            status: 'PUBLISHED'
          },
          select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            image: true,
            readTime: true,
            publishedAt: true,
            author: {
              select: {
                name: true,
                avatar: true
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
          }
        }
      }
    })
  } catch (error) {
    console.error('Error fetching category:', error)
    return null
  }
}

async function getCategoryMeta(slug: string) {
  try {
    return await prisma.category.findUnique({
      where: { slug },
      select: {
        name: true,
        description: true,
        color: true,
      },
    })
  } catch (error) {
    console.error('Error fetching category metadata:', error)
    return null
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await getCategoryWithPosts(params.slug)

  if (!category) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        {/* Back Button */}
        <div className="container mx-auto px-4 py-6">
          <LoadingLink href="/news" loadingLabel="Loading news feed…">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to All Articles
            </Button>
          </LoadingLink>
        </div>

        {/* Category Header */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center space-y-4">
            <Badge
              className="text-white text-lg px-4 py-2"
              style={{ backgroundColor: category.color || '#3B82F6' }}
            >
              {category.name}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              {category.name} Articles
            </h1>
            {category.description && (
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {category.description}
              </p>
            )}
            <p className="text-muted-foreground">
              {category.posts.length} {category.posts.length === 1 ? 'article' : 'articles'} in this category
            </p>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="container mx-auto px-4 pb-16">
          {category.posts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No articles in this category yet.</p>
              <p className="text-muted-foreground mt-2">Check back soon for new content!</p>
              <LoadingLink href="/news" className="mt-4 inline-block" loadingLabel="Loading news feed…">
                <Button>Browse All Articles</Button>
              </LoadingLink>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.posts.map((post) => (
                <LoadingLink key={post.id} href={`/blog/${post.slug}`} loadingLabel="Loading article…">
                  <Card className="group hover:shadow-lg transition-all duration-300 h-full">
                    <div className="relative overflow-hidden bg-muted/30">
                      <FallbackImage
                        src={post.image}
                        alt={post.title}
                        className="w-full h-48 object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4 flex items-center space-x-2">
                        <Badge
                          variant="secondary"
                          className="text-white"
                          style={{ backgroundColor: post.category.color || '#3B82F6' }}
                        >
                          {post.category.name}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <h2 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground text-sm line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            <span>{post.author.name || 'ByteBrief Team'}</span>
                          </div>
                          {post.readTime && (
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{post.readTime} min</span>
                            </div>
                          )}
                        </div>
                        {post.publishedAt && (
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>
                              {formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })}
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </LoadingLink>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

// Generate metadata for SEO
export async function generateMetadata({ params }: CategoryPageProps) {
  const category = await getCategoryMeta(params.slug)

  if (!category) {
    return {
      title: 'Category Not Found - ByteBrief'
    }
  }

  return {
    title: `${category.name} Articles - ByteBrief`,
    description: category.description || `Browse all ${category.name} articles and insights on ByteBrief.`,
  }
}
