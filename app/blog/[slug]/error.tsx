// Clearance: friendly fallback if a blog post page throws during client rendering
'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { LoadingLink } from '@/components/ui/loading-link'

export default function BlogPostError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Blog post page error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center space-y-4">
        <h1 className="text-2xl font-bold text-foreground">Something went wrong</h1>
        <p className="text-muted-foreground">
          This article couldn’t be rendered on your device right now. You can try again, or go back home.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button onClick={reset} variant="outline">
            Try again
          </Button>
          <Button asChild>
            <LoadingLink href="/" loadingLabel="Loading home…">
              Back to Home
            </LoadingLink>
          </Button>
        </div>
      </div>
    </div>
  )
}

