// Posts management table component
'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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

  return (
    <div className="rounded-md border">

      {/* Sort toolbar (client-side display sorting only) */}
      <div className="flex flex-wrap items-center gap-3 p-3 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by</span>
          <Select value={sortKey} onValueChange={(v) => setSortKey(v as typeof sortKey)}>
            <SelectTrigger className="h-9 w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updatedAt">Last updated</SelectItem>
              <SelectItem value="status">Status</SelectItem>
              <SelectItem value="category">Category</SelectItem>
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
            className={`inline-flex items-center gap-2 border ${
              sortDir === 'desc'
                ? 'hover:bg-green-100 hover:text-green-800 border-green-200 dark:hover:bg-green-900/50 dark:hover:text-green-100'
                : 'hover:bg-green-100 hover:text-green-800 border-green-200 dark:hover:bg-green-900/50 dark:hover:text-green-100'
            }`}
          >
            <ArrowDownUp className="h-4 w-4" />
            {sortDir === 'asc' ? 'Asc' : 'Desc'}
          </Button>
        </div>
      </div>

      <Table className="w-full table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead className="px-4 w-[32%]">Title</TableHead>
            <TableHead className="px-4 w-[12%]">Status</TableHead>
            <TableHead className="px-4 w-[16%]">Category</TableHead>
            <TableHead className="px-4 w-[18%]">Author</TableHead>
            <TableHead className="px-4 w-[14%]">Published</TableHead>
            <TableHead className="px-4 w-[8%] text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedPosts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                No posts found. Create your first post to get started.
              </TableCell>
            </TableRow>
          ) : (
            sortedPosts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/admin/posts/${post.id}`}
                      className="hover:text-accent transition-colors line-clamp-1"
                      title={post.title}
                    >
                      {post.title}
                    </Link>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(post.status)}>
                    {post.status.toLowerCase()}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {post.category.color && (
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: post.category.color }}
                      />
                    )}
                    <span>{post.category.name}</span>
                  </div>
                </TableCell>
                <TableCell>{post.author.name || post.author.email}</TableCell>

                <TableCell>
                  {post.publishedAt ? (
                    format(new Date(post.publishedAt), 'MMM dd, yyyy')
                  ) : (
                    <span className="text-muted-foreground">Not published</span>
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-muted">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/blog/${post.slug}`} className="flex items-center">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/posts/${post.id}`} className="flex items-center">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setDeletePost(post)}
                        className="flex items-center text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <AlertDialog open={!!deletePost} onOpenChange={() => setDeletePost(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletePost?.title}"?
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
