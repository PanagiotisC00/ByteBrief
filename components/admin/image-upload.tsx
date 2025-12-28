// Image upload component for admin post forms
'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, X, Image as ImageIcon, Link, Loader2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  onAltChange: (alt: string) => void
  alt?: string
  placeholder?: string
}

export function ImageUpload({ value, onChange, onAltChange, alt = '', placeholder = 'Upload or enter image URL' }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [urlInput, setUrlInput] = useState(value)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setUploadError('Image must be less than 5MB')
      return
    }

    setIsUploading(true)
    setUploadError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const { url } = await response.json()
      onChange(url)
      
      // Auto-generate alt text from filename if none exists
      if (!alt) {
        const fileName = file.name.split('.')[0].replace(/[-_]/g, ' ')
        onAltChange(fileName)
      }
    } catch (error) {
      console.error('Upload error:', error)
      setUploadError('Failed to upload image. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleUrlSubmit = () => {
    onChange(urlInput)
  }

  const clearImage = () => {
    onChange('')
    onAltChange('')
    setUrlInput('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const displayImage = value || '/bytebrief-logo.png' // ByteBrief PNG logo

  return (
    <div className="space-y-4">
      <Label>Featured Image</Label>
      
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload File</TabsTrigger>
          <TabsTrigger value="url">Image URL</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="space-y-4">
          <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="p-4 bg-muted rounded-full">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">Drop an image here, or click to browse</p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF up to 5MB</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isUploading}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Choose File
                    </>
                  )}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </CardContent>
          </Card>
          
          {uploadError && (
            <p className="text-sm text-destructive">{uploadError}</p>
          )}
        </TabsContent>
        
        <TabsContent value="url" className="space-y-4">
          <div className="flex space-x-2">
            <Input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleUrlSubmit}
              disabled={!urlInput.trim()}
            >
              <Link className="h-4 w-4 mr-2" />
              Add URL
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Image Preview */}
      <div className="space-y-4">
        <div className="relative bg-muted rounded border">
          <div className={value ? "w-full h-48 rounded overflow-hidden" : "w-full h-32 rounded"}>
            <img
              src={value || '/bytebrief-logo.png'}
              alt={alt || 'Preview'}
              className={value ? "w-full h-full object-cover" : "w-full h-full object-contain bg-background p-4"}
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = '/bytebrief-logo.png'
              }}
            />
          </div>
          
          {value && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={clearImage}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          
          {!value && (
            <div className="absolute bottom-2 left-2 right-2">
              <div className="bg-background/90 backdrop-blur rounded px-2 py-1 text-center">
                <p className="text-xs text-muted-foreground">Default: ByteBrief logo</p>
              </div>
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="imageAlt">Alt Text</Label>
          <Input
            id="imageAlt"
            value={alt}
            onChange={(e) => onAltChange(e.target.value)}
            placeholder="Describe the image for accessibility..."
          />
          <p className="text-xs text-muted-foreground mt-1">
            Help screen readers understand what&apos;s in the image
          </p>
        </div>
      </div>
    </div>
  )
}
