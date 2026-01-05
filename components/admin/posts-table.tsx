// Posts management table component
'use client'

import { useRef, useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
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
import { Eye, Edit, Trash2, MoreHorizontal, ArrowDownUp } from 'lucide-react'
import { toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type PostWithDetails = {
  id: string
  title: string
  slug: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  publishedAt: Date | null
  createdAt: Date
  updatedAt: Date
  author: {
    name: string | null
    email: string
  }
  category: {
    name: string
    color: string | null
  }

}

interface PostsTableProps {
  posts: PostWithDetails[]
}

export function PostsTable({ posts }: PostsTableProps) {
  const router = useRouter()
  const pointerDownTarget = useRef<HTMLElement | null>(null)
  const [deletePost, setDeletePost] = useState<PostWithDetails | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [sortKey, setSortKey] = useState<'updatedAt' | 'status' | 'category'>('updatedAt')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const handleDelete = async () => {
    if (!deletePost) return

    setIsDeleting(true)

    try {
      const response = await fetch(`/api/admin/posts/${deletePost.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete post')
      }

      toast.success('Post deleted successfully')
      window.location.reload() // Simple refresh for now
    } catch (error) {
      console.error('Error deleting post:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to delete post')
    } finally {
      setIsDeleting(false)
      setDeletePost(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'ARCHIVED':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const statusRank: Record<string, number> = {
    PUBLISHED: 3,
    DRAFT: 2,
    ARCHIVED: 1
  }

  const sortedPosts = useMemo(() => {
    const direction = sortDir === 'asc' ? 1 : -1
    return [...posts].sort((a, b) => {
      if (sortKey === 'updatedAt') {
        const aDate = a.updatedAt ? new Date(a.updatedAt).getTime() : -Infinity
        const bDate = b.updatedAt ? new Date(b.updatedAt).getTime() : -Infinity
        return (aDate - bDate) * direction
      }

      if (sortKey === 'status') {
        const aRank = statusRank[a.status] ?? 0
        const bRank = statusRank[b.status] ?? 0
        return (aRank - bRank) * direction
      }

      if (sortKey === 'category') {
        const aName = a.category.name.toLowerCase()
        const bName = b.category.name.toLowerCase()
        if (aName < bName) return -1 * direction
        if (aName > bName) return 1 * direction
        return 0
      }

      return 0
    })
  }, [posts, sortDir, sortKey])

  const handleCardClick = (event: React.MouseEvent<HTMLElement>, postId: string) => {
    if (event.defaultPrevented) return
    const target = (pointerDownTarget.current ?? event.target) as HTMLElement | null
    pointerDownTarget.current = null
    if (target?.closest('[data-card-ignore="true"], a, button, [role=\"menuitem\"]')) return
    router.push(`/admin/posts/${postId}`)
  }

  return (
    <div className="space-y-4">
      {/* Sort toolbar (client-side display sorting only) */}
      <div className="flex flex-wrap items-center gap-3 rounded-md border border-border p-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by</span>
          <Select value={sortKey} onValueChange={(v) => setSortKey(v as typeof sortKey)}>
            <SelectTrigger className="h-9 w-44 !bg-primary !text-primary-foreground !border-transparent hover:!bg-[#7fffc1] hover:!text-[#0f1f16] data-[state=open]:!bg-[#7fffc1] data-[state=open]:!text-[#0f1f16] hover:[&_svg]:!text-[#0f1f16] data-[state=open]:[&_svg]:!text-[#0f1f16]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card text-card-foreground border-border">
              <SelectItem
                value="updatedAt"
                className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[highlighted]:bg-[#7fffc1] data-[highlighted]:text-[#0f1f16]"
              >
                Last updated
              </SelectItem>
              <SelectItem
                value="status"
                className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[highlighted]:bg-[#7fffc1] data-[highlighted]:text-[#0f1f16]"
              >
                Status
              </SelectItem>
              <SelectItem
                value="category"
                className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[highlighted]:bg-[#7fffc1] data-[highlighted]:text-[#0f1f16]"
              >
                Category
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Direction</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))}
            className="inline-flex items-center gap-2 !bg-primary !text-primary-foreground !border-transparent hover:!bg-[#7fffc1] hover:!text-[#0f1f16]"
          >
            <ArrowDownUp className="h-4 w-4" />
            {sortDir === 'asc' ? 'Asc' : 'Desc'}
          </Button>
        </div>
      </div>

      {sortedPosts.length === 0 ? (
        <div className="rounded-md border border-border py-10 text-center text-muted-foreground">
          No posts found. Create your first post to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sortedPosts.map((post) => (
            <Card
              key={post.id}
              role="button"
              tabIndex={0}
              onPointerDown={(event) => {
                pointerDownTarget.current = event.target as HTMLElement | null
              }}
              onClick={(event) => handleCardClick(event, post.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  router.push(`/admin/posts/${post.id}`)
                }
              }}
              className="border-border/70 bg-card/95 cursor-pointer transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <CardHeader className="space-y-3 pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2">
                    <Link
                      href={`/admin/posts/${post.id}`}
                      data-card-ignore="true"
                      className="text-lg font-semibold text-foreground transition-colors hover:text-accent break-words"
                    >
                      {post.title}
                    </Link>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <Badge className={getStatusColor(post.status)}>
                        {post.status.toLowerCase()}
                      </Badge>
                      <div className="flex items-center gap-1">
                        {post.category.color && (
                          <div
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: post.category.color }}
                          />
                        )}
                        <span>{post.category.name}</span>
                      </div>
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
                    <DropdownMenuContent
                      align="end"
                      data-card-ignore="true"
                      onClick={(event) => event.stopPropagation()}
                      onPointerDown={(event) => event.stopPropagation()}
                    >
                      <DropdownMenuItem asChild>
                        <Link href={`/blog/${post.slug}`} className="flex items-center" data-card-ignore="true">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/posts/${post.id}`} className="flex items-center" data-card-ignore="true">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(event) => {
                          event.stopPropagation()
                          setDeletePost(post)
                        }}
                        data-card-ignore="true"
                        className="flex items-center text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span>Author: {post.author.name || post.author.email}</span>
                  <span>Updated {format(new Date(post.updatedAt), 'MMM dd, yyyy')}</span>
                  {post.publishedAt ? (
                    <span>Published {format(new Date(post.publishedAt), 'MMM dd, yyyy')}</span>
                  ) : (
                    <span>Not published</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={!!deletePost} onOpenChange={() => setDeletePost(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deletePost?.title}&quot;?
              This action cannot be undone and will permanently remove the post and all its data.
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
    </div>
  )
}
