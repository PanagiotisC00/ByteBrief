// Middleware for protecting admin routes
import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(req) {
    // Debug admin route access attempts
    if (req.nextUrl.pathname.startsWith('/admin')) {
      console.log('🔍 MIDDLEWARE - Admin route accessed:', req.nextUrl.pathname)
      console.log('🔍 MIDDLEWARE - Token exists:', !!req.nextauth.token)
      console.log('🔍 MIDDLEWARE - Token role:', req.nextauth.token?.role)
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to login page without authentication
        if (req.nextUrl.pathname === '/admin/login') {
          return true
        }
        
        // TEMPORARILY DISABLE ADMIN PROTECTION TO DEBUG
        if (req.nextUrl.pathname.startsWith('/admin')) {
          console.log('🚨 MIDDLEWARE DEBUG - Token:', JSON.stringify(token, null, 2))
          console.log('🚨 MIDDLEWARE DEBUG - Allowing access for debugging...')
          return true // TEMPORARILY ALLOW ALL ADMIN ACCESS
        }
        
        return true
      }
    }
  }
)

export const config = {
  matcher: [
    '/admin/:path*'
  ]
}
