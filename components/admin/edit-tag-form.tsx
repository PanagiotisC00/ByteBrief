'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Trash2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import Link from 'next/link'

type TagWithCount = {
  id: string
  name: string
  slug: string
  _count: {
    posts: number
  }
}

interface EditTagFormProps {
  tag: TagWithCount
}

export function EditTagForm({ tag }: EditTagFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [formData, setFormData] = useState({
    name: tag.name,
  })

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const slug = generateSlug(formData.name)
      
      const response = await fetch(`/api/admin/tags/${tag.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          slug
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update tag')
      }

      toast.success('Tag updated successfully')
      router.push('/admin/tags')
    } catch (error) {
      console.error('Error updating tag:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update tag')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    
    try {
      const response = await fetch(`/api/admin/tags/${tag.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete tag')
      }

      toast.success('Tag deleted successfully')
      router.push('/admin/tags')
    } catch (error) {
      console.error('Error deleting tag:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to delete tag')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" asChild>
          <Link href="/admin/tags">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tags
          </Link>
        </Button>
        
        {tag._count.posts === 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive" 
                size="sm"
                className="bg-red-600 hover:bg-red-700 hover:scale-105 hover:shadow-lg text-white hover:text-white transition-all duration-200 cursor-pointer transform"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Tag
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Tag</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{tag.name}"? This action cannot be undone.
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
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tag Details</CardTitle>
          {tag._count.posts > 0 && (
            <p className="text-sm text-muted-foreground">
              This tag is used in {tag._count.posts} published post{tag._count.posts !== 1 ? 's' : ''} and cannot be deleted.
            </p>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., javascript, react, tutorial"
                required
              />
              <p className="text-xs text-muted-foreground">
                Slug: {generateSlug(formData.name) || 'tag-slug'}
              </p>
              <p className="text-xs text-muted-foreground">
                Tags are used to help categorize and filter your blog posts. Keep them short and descriptive.
              </p>
            </div>

            <div className="flex items-center space-x-4 pt-4">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 hover:scale-105 hover:shadow-lg text-white hover:text-white transition-all duration-200 cursor-pointer transform"
              >
                {isLoading ? 'Updating...' : 'Update Tag'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200 cursor-pointer"
                asChild
              >
                <Link href="/admin/tags">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
