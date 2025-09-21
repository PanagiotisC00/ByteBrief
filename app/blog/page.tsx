import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { prisma } from "@/lib/prisma"
import { FallbackImage } from "@/components/ui/fallback-image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Calendar, Clock, User, Eye } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

// Get all published blog posts
async function getBlogPosts() {
  try {
    return await prisma.post.findMany({
      where: {
        status: 'PUBLISHED'
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
        }
      },
      orderBy: {
        publishedAt: 'desc'
      }
    })
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
}

// Get categories for sidebar
async function getCategories() {
  try {
    return await prisma.category.findMany({
      include: {
        _count: {
          select: {
            posts: {
              where: {
                status: 'PUBLISHED'
              }
            }
          }
        }
      }
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([
    getBlogPosts(),
    getCategories()
  ])

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        {/* Header */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              All Articles
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore our complete collection of tech news, insights, and analysis
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {posts.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-muted-foreground text-lg">No articles published yet.</p>
                  <p className="text-muted-foreground mt-2">Check back soon for new content!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {posts.map((post) => (
                    <Link key={post.id} href={`/blog/${post.slug}`}>
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
                          {post.viewCount && (
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Eye className="h-3 w-3 mr-1" />
                              <span>{post.viewCount.toLocaleString()} views</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-6 sticky top-24">
                {/* Categories */}
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold text-foreground">Categories</h3>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {categories.map((category) => (
                      <Link 
                        key={category.id} 
                        href={`/category/${category.slug}`}
                        className="flex items-center justify-between p-2 rounded hover:bg-muted transition-colors"
                      >
                        <span className="text-sm text-foreground">{category.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {category._count.posts}
                        </Badge>
                      </Link>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export const metadata = {
  title: 'All Articles - ByteBrief',
  description: 'Browse all our tech articles, news, and insights in one place.',
}
