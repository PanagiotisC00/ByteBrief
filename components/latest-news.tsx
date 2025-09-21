import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, User, ArrowRight } from "lucide-react"
import { FallbackImage } from "@/components/ui/fallback-image"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

// Type for latest news articles from database
type LatestArticle = {
  id: string
  title: string
  excerpt: string | null
  image: string | null
  slug: string
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

interface LatestNewsProps {
  articles: LatestArticle[]
}

export function LatestNews({ articles }: LatestNewsProps) {
  if (!articles || articles.length === 0) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Latest <span className="text-accent">News</span>
            </h2>
            <p className="text-muted-foreground">
              Latest articles will appear here once published.
            </p>
          </div>
        </div>
      </section>
    )
  }
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Latest <span className="text-accent">News</span>
            </h2>
            <p className="text-muted-foreground text-lg">Stay updated with breaking tech news and developments</p>
          </div>
          <Button
            variant="outline"
            asChild
            className="hidden md:flex items-center space-x-2 border-accent text-accent hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 hover:border-slate-300 dark:hover:border-slate-600 bg-transparent hover:scale-105 hover:shadow-lg transition-all duration-200 cursor-pointer transform"
          >
            <Link href="/news">
              <span>View All News</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Card
              key={article.id}
              className="group hover:shadow-lg transition-all duration-300 bg-card border-border hover:border-primary/50"
            >
              <div className="relative overflow-hidden bg-muted/30">
                <FallbackImage
                  src={article.image}
                  alt={article.title}
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
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-3">
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
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Button 
            variant="outline" 
            asChild
            className="border-accent text-accent hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 hover:border-slate-300 dark:hover:border-slate-600 bg-transparent hover:scale-105 hover:shadow-lg transition-all duration-200 cursor-pointer transform"
          >
            <Link href="/news">
              View All News
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
