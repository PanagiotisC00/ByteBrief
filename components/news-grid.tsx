import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, User, Eye } from "lucide-react"
import { FallbackImage } from "@/components/ui/fallback-image"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

type NewsPost = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  image: string | null
  imageAlt: string | null
  viewCount: number
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
  tags: {
    tag: {
      id: string
      name: string
      slug: string
    }
  }[]
}

interface NewsGridProps {
  posts: NewsPost[]
}

export function NewsGrid({ posts }: NewsGridProps) {
  if (!posts || posts.length === 0) {
    return (
      <div className="space-y-8">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-foreground mb-4">No Posts Found</h2>
          <p className="text-muted-foreground">
            There are currently no published posts to display. Check back later for the latest tech news.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* All Articles */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Latest News</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {posts.map((article) => (
            <Card
              key={article.id}
              className="group hover:shadow-lg transition-all duration-300 bg-card border-border hover:border-primary/50"
            >
              <div className="relative overflow-hidden bg-muted/30">
                <FallbackImage
                  src={article.image}
                  alt={article.imageAlt || article.title}
                  className="w-full h-40 object-contain group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <Badge 
                    variant="secondary" 
                    className="text-white text-xs"
                    style={{ backgroundColor: article.category.color || '#3B82F6' }}
                  >
                    {article.category.name}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4 space-y-3">
                <h3 className="text-lg font-semibold text-card-foreground group-hover:text-accent transition-colors line-clamp-2">
                  <Link href={`/blog/${article.slug}`}>{article.title}</Link>
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-2">{article.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span>{article.author.name || 'ByteBrief Team'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>
                        {article.publishedAt
                          ? formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })
                          : 'Recently'
                        }
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Eye className="h-3 w-3" />
                      <span>{article.viewCount.toLocaleString()}</span>
                    </div>
                    {article.readTime && (
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{article.readTime}m</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
