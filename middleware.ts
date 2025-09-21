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
        
        // Protect other admin routes
        if (req.nextUrl.pathname.startsWith('/admin')) {
          const isAuthorized = token?.role === 'ADMIN' || token?.role === 'SUPER_ADMIN'
          console.log('🔍 MIDDLEWARE - Authorization check:', isAuthorized)
          return isAuthorized
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
