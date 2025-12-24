import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { User, ArrowRight, Calendar, Clock } from "lucide-react"
import { FallbackImage } from "@/components/ui/fallback-image"
import { LoadingLink } from "@/components/ui/loading-link"
import { format } from "date-fns"

// Type for latest news articles from database
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
            className="hidden md:flex items-center space-x-2 border-accent text-accent hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 hover:border-slate-300 dark:hover:border-slate-600 bg-transparent hover:scale-105 hover:shadow-lg transition-all duration-200 cursor-pointer transform"
            asChild
          >
            <LoadingLink href="/news" loadingLabel="Loading news feed…">
              <span>View All News</span>
              <ArrowRight className="h-4 w-4" />
            </LoadingLink>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <LoadingLink key={article.id} href={`/blog/${article.slug}`} className="block" loadingLabel="Loading article…">
              <Card
                className="group hover:shadow-lg transition-all duration-300 bg-card border-border hover:border-primary/50 cursor-pointer h-full"
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
                    {article.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-2">{article.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{article.author.name || 'ByteBrief Team'}</span>
                      </div>
                      {article.readTime && (
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{article.readTime}m</span>
                        </div>
                      )}
                    </div>
                    {article.publishedAt && (
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{format(new Date(article.publishedAt), 'dd/MM/yyyy')}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </LoadingLink>
          ))}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Button
            variant="outline"
            className="border-accent text-accent hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 hover:border-slate-300 dark:hover:border-slate-600 bg-transparent hover:scale-105 hover:shadow-lg transition-all duration-200 cursor-pointer transform"
            asChild
          >
            <LoadingLink href="/news" loadingLabel="Loading news feed…">
              View All News
            </LoadingLink>
          </Button>
        </div>
      </div>
    </section>
  )
}
