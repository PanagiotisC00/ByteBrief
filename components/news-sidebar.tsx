import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Clock, User, Eye } from "lucide-react"
import Link from "next/link"

type TrendingCategory = {
  id: string
  name: string
  slug: string
  color: string | null
  _count: {
    posts: number
  }
}

type PopularPost = {
  id: string
  title: string
  slug: string
  viewCount: number
  readTime: number | null
  author: {
    name: string | null
    avatar: string | null
  }
}

interface NewsSidebarProps {
  trendingCategories: TrendingCategory[]
  popularPosts: PopularPost[]
}

export function NewsSidebar({ trendingCategories, popularPosts }: NewsSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Trending Topics */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-foreground">
            <TrendingUp className="h-5 w-5 text-accent" />
            <span>Trending Topics</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {trendingCategories.length > 0 ? (
            trendingCategories.map((category) => (
              <div key={category.id} className="flex items-center justify-between">
                <Link
                  href={`/category/${category.slug}`}
                  className="text-sm text-card-foreground hover:text-accent transition-colors"
                >
                  {category.name}
                </Link>
                <Badge variant="secondary" className="text-xs bg-muted text-muted-foreground">
                  {category._count.posts}
                </Badge>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No trending categories yet.</p>
          )}
        </CardContent>
      </Card>

      {/* Popular Articles */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-foreground">
            <TrendingUp className="h-5 w-5 text-accent" />
            <span>Popular This Week</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {popularPosts.length > 0 ? (
            popularPosts.map((article, index) => (
              <div key={article.id} className="space-y-2">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl font-bold text-accent/50">{index + 1}</span>
                  <div className="flex-1 space-y-1">
                    <Link
                      href={`/blog/${article.slug}`}
                      className="text-sm font-medium text-card-foreground hover:text-accent transition-colors line-clamp-2"
                    >
                      {article.title}
                    </Link>
                    <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{article.author.name || 'ByteBrief Team'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="h-3 w-3" />
                        <span>{article.viewCount.toLocaleString()} views</span>
                      </div>
                      {article.readTime && (
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{article.readTime} min</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {index < popularPosts.length - 1 && <div className="border-b border-border" />}
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No popular articles yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
