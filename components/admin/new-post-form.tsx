// New post creation form component
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { X, Plus } from 'lucide-react'
import { ImageUpload } from '@/components/admin/image-upload'

// Types
type Category = {
  id: string
  name: string
  slug: string
  color: string | null
}

type Tag = {
  id: string
  name: string
  slug: string
}

interface NewPostFormProps {
  categories: Category[]
  tags: Tag[]
  authorId: string
}

export function NewPostForm({ categories, tags, authorId }: NewPostFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    image: '',
    imageAlt: '',
    categoryId: '',
    sources: '',
    status: 'DRAFT' as 'DRAFT' | 'PUBLISHED',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          authorId,
          tags: selectedTags,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create post')
      }

      const post = await response.json()
      router.push(`/admin/posts/${post.id}`)
    } catch (error) {
      console.error('Error creating post:', error)
      alert('Failed to create post. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    )
  }

  const selectedTagObjects = tags.filter(tag => selectedTags.includes(tag.id))

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Post Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter post title..."
                  required
                />
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Brief description of the post..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Write your blog post content in Markdown..."
                  rows={20}
                  className="font-mono"
                  required
                />
                <p className="text-sm text-muted-foreground mt-2">
                  You can use Markdown formatting (# for headers, **bold**, etc.)
                </p>
              </div>

              <div>
                <Label htmlFor="sources">Sources</Label>
                <Textarea
                  id="sources"
                  value={formData.sources}
                  onChange={(e) => setFormData(prev => ({ ...prev, sources: e.target.value }))}
                  placeholder="Enter source URLs separated by commas (e.g., https://source1.com, https://source2.com)"
                  rows={3}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Enter source URLs separated by commas. These will be displayed at the bottom of your post.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Publish Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as 'DRAFT' | 'PUBLISHED' }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>

            </CardContent>
          </Card>

          {/* Category */}
          <Card>
            <CardHeader>
              <CardTitle>Category</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category..." />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center space-x-2">
                        {category.color && (
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                        )}
                        <span>{category.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedTagObjects.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedTagObjects.map((tag) => (
                    <Badge key={tag.id} variant="secondary" className="flex items-center gap-1">
                      {tag.name}
                      <button
                        type="button"
                        onClick={() => toggleTag(tag.id)}
                        className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              
              <div className="space-y-2">
                <Label>Available Tags</Label>
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                  {tags.filter(tag => !selectedTags.includes(tag.id)).map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.id)}
                      className="inline-flex items-center gap-1 px-2 py-1 text-sm bg-muted hover:bg-muted-foreground/20 rounded-md transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Featured Image */}
          <Card>
            <CardHeader>
              <CardTitle>Featured Image</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                value={formData.image}
                onChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
                onAltChange={(alt) => setFormData(prev => ({ ...prev, imageAlt: alt }))}
                alt={formData.imageAlt}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-between pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          className="hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200 cursor-pointer"
          onClick={() => router.push('/admin/posts')}
        >
          Cancel
        </Button>
        
        <Button 
          type="submit" 
          disabled={isLoading || !formData.title.trim()}
          className="bg-blue-600 hover:bg-blue-700 hover:scale-105 hover:shadow-lg text-white hover:text-white transition-all duration-200 cursor-pointer transform"
        >
          {isLoading ? 'Creating...' : 'Create Post'}
        </Button>
      </div>
    </form>
  )
}
