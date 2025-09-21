// Admin login page
'use client'

import { useState, useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Code2 } from 'lucide-react'
import Link from 'next/link'

export default function AdminLoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { data: session, status } = useSession()
  const router = useRouter()

  // Redirect to admin if already authenticated and is admin (prevent infinite loops)
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      if (session.user.role === 'ADMIN' || session.user.role === 'SUPER_ADMIN') {
        // Only redirect if we're not already redirecting
        if (!isLoading) {
          setIsLoading(true) // Prevent multiple redirects
          window.location.replace('/admin') // Use replace to avoid back button issues
        }
      }
    }
  }, [session, status, isLoading])

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      console.log('Starting Google sign in...')
      // Use NextAuth's built-in redirect - much simpler and more reliable
      await signIn('google', { 
        callbackUrl: '/admin',
        redirect: true  // Let NextAuth handle the redirect
      })
    } catch (error) {
      console.error('Sign in error:', error)
      setIsLoading(false) // Only set loading to false on error since redirect will happen on success
    }
  }

  // Show loading if checking session
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-accent border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Link href="/" className="flex items-center space-x-2 group">
              <Code2 className="h-8 w-8 text-primary group-hover:text-accent transition-colors" />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                ByteBrief
              </span>
            </Link>
          </div>
          <CardTitle className="text-2xl">Admin Access</CardTitle>
          <CardDescription>
            Sign in to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90"
          >
            {isLoading ? 'Signing in...' : 'Sign in with Google'}
          </Button>
          
          <div className="text-center text-sm text-muted-foreground">
            <p>Only authorized administrators can access this area.</p>
            <Link href="/" className="text-accent hover:underline">
              ← Back to main site
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
