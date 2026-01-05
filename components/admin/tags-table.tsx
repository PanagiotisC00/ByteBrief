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
import { MoreHorizontal, Edit, Trash2, Tag, Search, Eye } from 'lucide-react'
import { toast } from 'sonner'

type TagWithCount = {
  id: string
  name: string
  slug: string
  createdAt: Date
  updatedAt: Date
  _count: {
    posts: number
  }
}

interface TagsTableProps {
  tags: TagWithCount[]
}

export function TagsTable({ tags }: TagsTableProps) {
  const [deleteTag, setDeleteTag] = useState<TagWithCount | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const pointerDownTarget = useRef<HTMLElement | null>(null)
  const [query, setQuery] = useState('')
  const searchId = useId()
  const normalizedQuery = query.trim().toLowerCase()

  const filteredTags = useMemo(() => {
    if (!normalizedQuery) return tags
    return tags.filter((tag) => {
      return (
        tag.name.toLowerCase().includes(normalizedQuery) ||
        tag.slug.toLowerCase().includes(normalizedQuery)
      )
    })
  }, [tags, normalizedQuery])

  const groupedTags = useMemo(() => {
    const sortedTags = [...filteredTags].sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
    )
    const groups = new Map<string, TagWithCount[]>()
    for (const tag of sortedTags) {
      const trimmed = tag.name.trim()
      const letter = trimmed ? trimmed[0].toUpperCase() : '#'
      const groupKey = /[A-Z]/.test(letter) ? letter : '#'
      const group = groups.get(groupKey)
      if (group) {
        group.push(tag)
      } else {
        groups.set(groupKey, [tag])
      }
    }

    const sortKey = (letter: string) => (letter === '#' ? '0' : `1${letter}`)
    return Array.from(groups.entries())
      .sort((a, b) => sortKey(a[0]).localeCompare(sortKey(b[0])))
      .map(([letter, groupTags]) => ({ letter, tags: groupTags }))
  }, [filteredTags])

  const handleDelete = async () => {
    if (!deleteTag) return

    setIsDeleting(true)
    
    try {
      const response = await fetch(`/api/admin/tags/${deleteTag.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete tag')
      }

      toast.success('Tag deleted successfully')
      window.location.reload() // Simple refresh for now
    } catch (error) {
      console.error('Error deleting tag:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to delete tag')
    } finally {
      setIsDeleting(false)
      setDeleteTag(null)
    }
  }

  if (tags.length === 0) {
    return (
      <div className="text-center py-16">
        <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No tags yet</h3>
        <p className="text-muted-foreground mb-4">
          Create your first tag to help organize and categorize your blog posts.
        </p>
        <Button asChild>
          <Link href="/admin/tags/new">Create Tag</Link>
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full max-w-md">
          <label htmlFor={searchId} className="sr-only">Search tags</label>
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id={searchId}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search tags..."
            className="pl-8"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {filteredTags.length} result{filteredTags.length === 1 ? '' : 's'}
        </p>
      </div>

      {filteredTags.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border/60 bg-card/40 p-8 text-center text-sm text-muted-foreground">
          No tags match your search.
        </div>
      ) : (
        <div className="space-y-8">
          {groupedTags.map((group) => (
            <div key={group.letter} className="space-y-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {group.letter}
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {group.tags.map((tag) => (
                  <div
                    key={tag.id}
                    role="link"
                    tabIndex={0}
                    onPointerDown={(event) => {
                      pointerDownTarget.current = event.target as HTMLElement | null
                    }}
                    onClick={(event) => {
                      const target = (pointerDownTarget.current ?? event.target) as HTMLElement | null
                      pointerDownTarget.current = null
                      if (target?.closest('[data-card-ignore="true"]')) return
                      window.open(`/tag/${tag.slug}`, '_blank', 'noopener,noreferrer')
                    }}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        window.open(`/tag/${tag.slug}`, '_blank', 'noopener,noreferrer')
                      }
                    }}
                    className="rounded-lg border border-border/60 bg-card p-4 cursor-pointer transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded bg-accent/10 border border-accent/20">
                          <Tag className="h-4 w-4 text-accent" />
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">{tag.name}</div>
                          <div className="text-xs text-muted-foreground">#{tag.slug}</div>
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
                        <DropdownMenuContent align="end" data-card-ignore="true">
                          <DropdownMenuItem asChild data-card-ignore="true">
                            <Link
                              href={`/tag/${tag.slug}`}
                              className="flex items-center"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/tags/${tag.id}`} className="flex items-center">
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeleteTag(tag)}
                            className="flex items-center text-destructive focus:text-destructive"
                            disabled={tag._count.posts > 0}
                            data-card-ignore="true"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                      <Badge variant="secondary" className="bg-muted text-muted-foreground">
                        {tag._count.posts} post{tag._count.posts !== 1 ? 's' : ''}
                      </Badge>
                      <span>{formatDistanceToNow(new Date(tag.createdAt), { addSuffix: true })}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteTag} onOpenChange={() => setDeleteTag(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Tag</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the tag &quot;{deleteTag?.name}&quot;? 
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
