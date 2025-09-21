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

  // DEBUG: Show session info instead of redirecting
  useEffect(() => {
    console.log('=== LOGIN PAGE DEBUG ===')
    console.log('Status:', status)
    console.log('Session exists:', !!session)
    console.log('User:', session?.user)
    console.log('Role:', session?.user?.role)
    console.log('========================')
  }, [session, status])

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

  // Show loading if checking session (status can be 'loading', 'authenticated', or 'unauthenticated')
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
          {/* DEBUG INFO */}
          <div className="p-3 bg-muted rounded-lg text-xs space-y-1">
            <div><strong>Status:</strong> {status}</div>
            <div><strong>Session:</strong> {session ? 'Yes' : 'No'}</div>
            {session?.user && (
              <>
                <div><strong>Email:</strong> {session.user.email}</div>
                <div><strong>Role:</strong> {session.user.role || 'undefined'}</div>
              </>
            )}
          </div>

          <Button 
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90"
          >
            {isLoading ? 'Signing in...' : 'Sign in with Google'}
          </Button>

          {/* Manual redirect button for testing */}
          {status === 'authenticated' && session?.user?.role === 'ADMIN' && (
            <Button 
              onClick={(e) => {
                e.preventDefault()
                alert('Button clicked! Redirecting to /admin...')
                console.log('Attempting redirect to /admin')
                setTimeout(() => {
                  window.location.replace('/admin')
                }, 100)
              }}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Go to Admin Dashboard
            </Button>
          )}

          {/* Alternative: Direct link test */}
          {status === 'authenticated' && session?.user?.role === 'ADMIN' && (
            <div className="text-center">
              <a 
                href="/admin" 
                className="inline-block w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded text-center"
                onClick={() => alert('Link clicked!')}
              >
                Alternative: Direct Link to Admin
              </a>
            </div>
          )}
          
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
