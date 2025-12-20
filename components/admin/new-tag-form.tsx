'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { useMemo } from 'react'

type NewTagMode = 'page' | 'dialog'

interface NewTagFormProps {
  mode?: NewTagMode
  onCreated?: (tag: { id: string; name: string; slug: string }) => void
  onCancel?: () => void
}

export function NewTagForm({ mode = 'page', onCreated, onCancel }: NewTagFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
  })

  const generateSlug = useMemo(() => (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const slug = generateSlug(formData.name)
      
      const response = await fetch('/api/admin/tags', {
        method: 'POST',
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
        throw new Error(error.error || 'Failed to create tag')
      }

      toast.success('Tag created successfully')

      if (mode === 'dialog') {
        const tag = await response.json()
        onCreated?.(tag)
        setIsLoading(false)
        return
      }

      router.push('/admin/tags')
    } catch (error) {
      console.error('Error creating tag:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create tag')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {mode === 'page' && (
        <div>
          <Button variant="ghost" asChild>
            <Link href="/admin/tags">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tags
            </Link>
          </Button>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Tag Details</CardTitle>
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
                {isLoading ? 'Creating...' : 'Create Tag'}
              </Button>
              {mode === 'page' ? (
                <Button 
                  type="button" 
                  variant="outline" 
                  className="hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200 cursor-pointer"
                  asChild
                >
                  <Link href="/admin/tags">Cancel</Link>
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200 cursor-pointer"
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
