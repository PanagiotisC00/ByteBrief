import { Card, CardContent } from "@/components/ui/card"
import { Cpu, Smartphone, Cloud, Shield, Zap, Globe, Brain, Database, Code2, Server, Link as LinkIcon } from "lucide-react"
import Link from "next/link"

// Type for categories from database
type Category = {
  id: string
  name: string
  slug: string
  description: string | null
  color: string | null
  icon: string | null
  _count: {
    posts: number
  }
}

interface TechCategoriesProps {
  categories: Category[]
}

// Icon mapping for categories
const iconMap: Record<string, any> = {
  Brain,
  Cpu,
  Smartphone,
  Cloud,
  Shield,
  Globe,
  Zap,
  Database,
  Code2,
  Server,
  Link: LinkIcon,
}

export function TechCategories({ categories }: TechCategoriesProps) {
  if (!categories || categories.length === 0) {
    return (
      <section className="py-16 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Explore <span className="text-accent">Categories</span>
            </h2>
            <p className="text-muted-foreground">
              Categories will appear here once content is published.
            </p>
          </div>
        </div>
      </section>
    )
  }
  return (
    <section className="py-16 bg-card/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Explore <span className="text-accent">Categories</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover content tailored to your interests across various technology domains
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const IconComponent = iconMap[category.icon || 'Code2'] || Code2
            return (
              <Link key={category.id} href={`/category/${category.slug}`}>
                <Card className="group hover:shadow-lg transition-all duration-300 bg-card border-border hover:border-primary/50 cursor-pointer h-full">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="flex justify-center">
                      <IconComponent
                        className="h-12 w-12 text-primary group-hover:scale-110 transition-transform duration-300"
                        style={{ color: category.color || undefined }}
                      />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-card-foreground group-hover:text-accent transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {category.description || `Explore ${category.name.toLowerCase()} content`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {category._count.posts} article{category._count.posts !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
