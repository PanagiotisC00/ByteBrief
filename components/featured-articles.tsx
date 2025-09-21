import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, User, TrendingUp } from "lucide-react"
import { FallbackImage } from "@/components/ui/fallback-image"
import Link from "next/link"

// Type for top articles from database
type TopArticle = {
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

interface TopArticlesProps {
  articles: TopArticle[]
}

export function TopArticles({ articles }: TopArticlesProps) {
  if (!articles || articles.length === 0) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Top <span className="text-accent">Articles</span>
            </h2>
            <p className="text-muted-foreground">
              No top articles available. Check back soon for quality tech content!
            </p>
          </div>
        </div>
      </section>
    )
  }
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Top <span className="text-accent">Articles</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Dive deep into the most important tech stories shaping our digital future
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Card
              key={article.id}
              className="group hover:shadow-lg transition-all duration-300 bg-card border-border hover:border-primary/50"
            >
              <div className="relative overflow-hidden bg-muted/30">
                <FallbackImage
                  src={article.image}
                  alt={article.title}
                  className="w-full h-48 object-contain group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <Badge 
                    variant="secondary" 
                    className="text-white"
                    style={{ backgroundColor: article.category.color || '#3B82F6' }}
                  >
                    {article.category.name}
                  </Badge>
                </div>
              </div>
              <CardHeader className="pb-2">
                <h3 className="text-xl font-bold text-card-foreground group-hover:text-accent transition-colors line-clamp-2">
                  <Link href={`/blog/${article.slug}`}>{article.title}</Link>
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm line-clamp-3">{article.excerpt}</p>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{article.author.name || 'ByteBrief Team'}</span>
                    </div>
                    {article.readTime && (
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{article.readTime} min read</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
