// New post creation form component
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RichTextEditor } from '@/components/admin/rich-text-editor'
import { MarkdownEditor } from '@/components/admin/markdown-editor'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { X, Plus, Loader2 } from 'lucide-react'
import { ImageUpload } from '@/components/admin/image-upload'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { NewCategoryForm } from '@/components/admin/new-category-form'
import { NewTagForm } from '@/components/admin/new-tag-form'
import { toast } from 'sonner'

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
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const [categoriesState, setCategoriesState] = useState(categories)
  const [tagsState, setTagsState] = useState(tags)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [editorMode, setEditorMode] = useState<'richtext' | 'markdown'>('richtext')

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

  // Warn on refresh/close when there are unsaved changes
  useEffect(() => {
    if (!isDirty) return
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [isDirty])

  const markDirty = () => {
    if (!isDirty) setIsDirty(true)
  }

  // Intercept internal navigations when dirty (e.g., clicking other admin links)
  useEffect(() => {
    if (!isDirty) return

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (!target) return
      const anchor = target.closest('a') as HTMLAnchorElement | null
      if (!anchor) return

      // ignore new tab / download / external
      if (anchor.target === '_blank' || anchor.download) return
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return

      const href = anchor.getAttribute('href')
      if (!href) return
      // Only guard internal navigations
      const isExternal = href.startsWith('http://') || href.startsWith('https://')
      if (isExternal) return

      // same-page hash or same path
      if (href.startsWith('#') || href === window.location.pathname) return

      const proceed = window.confirm('You have unsaved changes. Leave this page?')
      if (!proceed) {
        e.preventDefault()
        e.stopPropagation()
      }
    }

    document.addEventListener('click', handleClick, true)
    return () => document.removeEventListener('click', handleClick, true)
  }, [isDirty])

  const confirmNavigation = async (action: () => void) => {
    if (!isDirty) {
      action()
      return
    }
    const proceed = window.confirm('You have unsaved changes. Leave this page?')
    if (proceed) action()
  }

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

      await response.json()
      toast.success('Post created successfully')
      setIsDirty(false)
      router.push('/admin/posts')
      router.refresh()
    } catch (error) {
      console.error('Error creating post:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create post. Please try again.')
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

  const selectedTagObjectsState = tagsState.filter(tag => selectedTags.includes(tag.id))

  return (
    <>
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
                  onChange={(e) => { markDirty(); setFormData(prev => ({ ...prev, title: e.target.value }))}}
                  placeholder="Enter post title..."
                  required
                />
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => { markDirty(); setFormData(prev => ({ ...prev, excerpt: e.target.value }))}}
                  placeholder="Brief description of the post..."
                  rows={3}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="content">Content *</Label>
                  <Tabs value={editorMode} onValueChange={(v) => setEditorMode(v as 'richtext' | 'markdown')}>
                    <TabsList className="h-8">
                      <TabsTrigger value="richtext" className="text-xs px-3 h-7">Rich Text</TabsTrigger>
                      <TabsTrigger value="markdown" className="text-xs px-3 h-7">Markdown</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                {editorMode === 'richtext' ? (
                  <RichTextEditor
                    value={formData.content}
                    onChange={(value) => { markDirty(); setFormData(prev => ({ ...prev, content: value }))}}
                    placeholder="Write your blog post content here..."
                  />
                ) : (
                  <MarkdownEditor
                    value={formData.content}
                    onChange={(value) => { markDirty(); setFormData(prev => ({ ...prev, content: value }))}}
                    placeholder="Write your blog post content in Markdown..."
                  />
                )}
              </div>

              <div>
                <Label htmlFor="sources">Sources</Label>
                <Textarea
                  id="sources"
                  value={formData.sources}
                  onChange={(e) => { markDirty(); setFormData(prev => ({ ...prev, sources: e.target.value }))}}
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
                onValueChange={(value) => { markDirty(); setFormData(prev => ({ ...prev, status: value as 'DRAFT' | 'PUBLISHED' }))}}
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
                onValueChange={(value) => { markDirty(); setFormData(prev => ({ ...prev, categoryId: value }))}}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category..." />
                </SelectTrigger>
                <SelectContent>
                  {categoriesState.map((category) => (
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
              <Button
                type="button"
                variant="outline"
                className="mt-3 w-full hover:bg-emerald-100 hover:text-emerald-800 border-emerald-200 dark:hover:bg-emerald-900/40 dark:hover:text-emerald-100"
                onClick={() => setIsCategoryDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create category
              </Button>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedTagObjectsState.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedTagObjectsState.map((tag) => (
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
                  {tagsState.map((tag) => {
                    const isSelected = selectedTags.includes(tag.id)
                    return (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => { if (!isSelected) { markDirty(); toggleTag(tag.id) } }}
                        disabled={isSelected}
                        className={`inline-flex items-center gap-1 px-2 py-1 text-sm rounded-md transition-colors
                          ${isSelected
                            ? 'bg-muted/60 text-muted-foreground cursor-not-allowed'
                            : 'bg-muted hover:bg-muted-foreground/20'}
                        `}
                      >
                        {!isSelected && <Plus className="h-3 w-3" />}
                        {tag.name}
                      </button>
                    )
                  })}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-2 w-full hover:bg-emerald-100 hover:text-emerald-800 border-emerald-200 dark:hover:bg-emerald-900/40 dark:hover:text-emerald-100"
                  onClick={() => setIsTagDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create tag
                </Button>
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
                onChange={(url) => { markDirty(); setFormData(prev => ({ ...prev, image: url }))}}
                onAltChange={(alt) => { markDirty(); setFormData(prev => ({ ...prev, imageAlt: alt }))}}
                alt={formData.imageAlt}
              />
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                className="hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200 cursor-pointer"
                onClick={() => confirmNavigation(() => router.push('/admin/posts'))}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isLoading || !formData.title.trim()}
                className="bg-blue-600 hover:bg-blue-700 hover:scale-105 hover:shadow-lg text-white hover:text-white transition-all duration-200 cursor-pointer transform"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating...
                  </span>
                ) : (
                  'Create Post'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
    
    {/* Category dialog */}
    <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Category</DialogTitle>
          <DialogDescription>Add a new category without leaving the post form.</DialogDescription>
        </DialogHeader>
        <NewCategoryForm
          mode="dialog"
          onCreated={(category) => {
            setCategoriesState((prev) => [...prev, category])
            setFormData((prev) => ({ ...prev, categoryId: category.id }))
            setIsCategoryDialogOpen(false)
          }}
          onCancel={() => setIsCategoryDialogOpen(false)}
        />
      </DialogContent>
    </Dialog>

    {/* Tag dialog */}
    <Dialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Tag</DialogTitle>
          <DialogDescription>Add a new tag without leaving the post form.</DialogDescription>
        </DialogHeader>
        <NewTagForm
          mode="dialog"
          onCreated={(tag) => {
            setTagsState((prev) => [...prev, tag])
            setSelectedTags((prev) => prev.includes(tag.id) ? prev : [...prev, tag.id])
            setIsTagDialogOpen(false)
          }}
          onCancel={() => setIsTagDialogOpen(false)}
        />
      </DialogContent>
    </Dialog>
    </>
  )
}
