import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp } from "lucide-react"
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

interface NewsSidebarProps {
  trendingCategories: TrendingCategory[]
}

export function NewsSidebar({ trendingCategories }: NewsSidebarProps) {
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
    </div>
  )
}
