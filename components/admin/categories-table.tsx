'use client'

import { useId, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { MoreHorizontal, Edit, Trash2, FolderOpen, Search } from 'lucide-react'
import { toast } from 'sonner'

type CategoryWithCount = {
  id: string
  name: string
  slug: string
  description: string | null
  color: string | null
  icon: string | null
  createdAt: Date
  updatedAt: Date
  _count: {
    posts: number
  }
}

interface CategoriesTableProps {
  categories: CategoryWithCount[]
}

export function CategoriesTable({ categories }: CategoriesTableProps) {
  const [deleteCategory, setDeleteCategory] = useState<CategoryWithCount | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const pointerDownTarget = useRef<HTMLElement | null>(null)
  const [query, setQuery] = useState('')
  const searchId = useId()
  const normalizedQuery = query.trim().toLowerCase()

  const filteredCategories = useMemo(() => {
    if (!normalizedQuery) return categories
    return categories.filter((category) => {
      const description = category.description?.toLowerCase() ?? ''
      return (
        category.name.toLowerCase().includes(normalizedQuery) ||
        category.slug.toLowerCase().includes(normalizedQuery) ||
        description.includes(normalizedQuery)
      )
    })
  }, [categories, normalizedQuery])

  const handleDelete = async () => {
    if (!deleteCategory) return

    setIsDeleting(true)
    
    try {
      const response = await fetch(`/api/admin/categories/${deleteCategory.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete category')
      }

      toast.success('Category deleted successfully')
      window.location.reload() // Simple refresh for now
    } catch (error) {
      console.error('Error deleting category:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to delete category')
    } finally {
      setIsDeleting(false)
      setDeleteCategory(null)
    }
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-16">
        <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No categories yet</h3>
        <p className="text-muted-foreground mb-4">
          Create your first category to start organizing your blog posts.
        </p>
        <Button asChild>
          <Link href="/admin/categories/new">Create Category</Link>
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full max-w-md">
          <label htmlFor={searchId} className="sr-only">Search categories</label>
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id={searchId}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search categories..."
            className="pl-8"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {filteredCategories.length} result{filteredCategories.length === 1 ? '' : 's'}
        </p>
      </div>

      {filteredCategories.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border/60 bg-card/40 p-8 text-center text-sm text-muted-foreground">
          No categories match your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              role="link"
              tabIndex={0}
              onPointerDown={(event) => {
                pointerDownTarget.current = event.target as HTMLElement | null
              }}
              onClick={(event) => {
                const target = (pointerDownTarget.current ?? event.target) as HTMLElement | null
                pointerDownTarget.current = null
                if (target?.closest('[data-card-ignore="true"]')) return
                window.open(`/category/${category.slug}`, '_blank', 'noopener,noreferrer')
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  window.open(`/category/${category.slug}`, '_blank', 'noopener,noreferrer')
                }
              }}
              className="rounded-lg border border-border/60 bg-card p-4 cursor-pointer transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="h-4 w-4 rounded"
                    style={{ backgroundColor: category.color || '#3B82F6' }}
                  />
                  <div>
                    <div className="font-semibold text-foreground">
                      <Link
                      href={`/category/${category.slug}`}
                      data-card-ignore="true"
                      className="hover:text-accent transition-colors"
                      target="_blank"
                    >
                      {category.name}
                    </Link>
                    </div>
                    <div className="text-xs text-muted-foreground">/{category.slug}</div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-muted"
                      data-card-ignore="true"
                    >
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild data-card-ignore="true">
                      <Link href={`/admin/categories/${category.id}`} className="flex items-center">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setDeleteCategory(category)}
                      data-card-ignore="true"
                      className="flex items-center text-destructive focus:text-destructive"
                      disabled={category._count.posts > 0}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {category.description && (
                <p className="mt-3 text-sm text-muted-foreground line-clamp-3">
                  {category.description}
                </p>
              )}

              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <Badge variant="secondary" className="bg-muted text-muted-foreground">
                  {category._count.posts} post{category._count.posts !== 1 ? 's' : ''}
                </Badge>
                <span>{formatDistanceToNow(new Date(category.createdAt), { addSuffix: true })}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteCategory} onOpenChange={() => setDeleteCategory(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the category &quot;{deleteCategory?.name}&quot;? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
