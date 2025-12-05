"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ArrowUpDown, ArrowDown, ArrowUp, Layers } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Category = {
  id: string
  name: string
  slug: string
  color: string | null
}

export type SortOption = 'date-desc' | 'date-asc' | 'topic'

interface NewsHeaderProps {
  categories: Category[]
  onCategoryChange: (categorySlug: string) => void
  onSearchChange: (searchQuery: string) => void
  onSortChange: (sort: SortOption) => void
  selectedCategory: string
  searchQuery: string
  sortBy: SortOption
}

const sortLabels: Record<SortOption, string> = {
  'date-desc': 'Latest First',
  'date-asc': 'Oldest First',
  'topic': 'By Topic'
}

export function NewsHeader({
  categories,
  onCategoryChange,
  onSearchChange,
  onSortChange,
  selectedCategory,
  searchQuery,
  sortBy
}: NewsHeaderProps) {

  return (
    <section className="bg-gradient-to-br from-background via-background to-card py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Tech <span className="text-accent">News</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Stay informed with the latest technology news, breakthroughs, and industry insights from around the world
          </p>
        </div>

        {/* Search and Filters */}
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder="Search tech news, articles, and insights..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg bg-card border-border"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              variant={selectedCategory === 'all' ? "default" : "outline"}
              size="sm"
              onClick={() => onCategoryChange('all')}
              className={
                selectedCategory === 'all'
                  ? "bg-primary text-primary-foreground"
                  : "border-border text-foreground hover:bg-accent/10 hover:text-accent bg-transparent"
              }
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.slug ? "default" : "outline"}
                size="sm"
                onClick={() => onCategoryChange(category.slug)}
                className={
                  selectedCategory === category.slug
                    ? "bg-primary text-primary-foreground"
                    : "border-border text-foreground hover:bg-accent/10 hover:text-accent bg-transparent"
                }
              >
                {category.name}
              </Button>
            ))}
          </div>

          {/* Sort Options - visually distinct */}
          <div className="flex items-center justify-center pt-4 border-t border-border/50">
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-accent hover:text-accent hover:bg-accent/10 font-medium min-w-[160px]">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  Sort: {sortLabels[sortBy]}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center">
                <DropdownMenuItem onClick={() => onSortChange('date-desc')}>
                  <ArrowDown className="h-4 w-4 mr-2" />
                  Latest First
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSortChange('date-asc')}>
                  <ArrowUp className="h-4 w-4 mr-2" />
                  Oldest First
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSortChange('topic')}>
                  <Layers className="h-4 w-4 mr-2" />
                  By Topic
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </section>
  )
}

