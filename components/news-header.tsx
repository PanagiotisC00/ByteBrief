"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, Calendar } from "lucide-react"

type Category = {
  id: string
  name: string
  slug: string
  color: string | null
}

interface NewsHeaderProps {
  categories: Category[]
  onCategoryChange: (categorySlug: string) => void
  onSearchChange: (searchQuery: string) => void
  selectedCategory: string
  searchQuery: string
}

export function NewsHeader({ 
  categories, 
  onCategoryChange, 
  onSearchChange, 
  selectedCategory, 
  searchQuery 
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

          {/* Filter Options */}
          <div className="flex items-center justify-center space-x-4 text-sm">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-accent">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-accent">
              <Calendar className="h-4 w-4 mr-2" />
              Sort by Date
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
