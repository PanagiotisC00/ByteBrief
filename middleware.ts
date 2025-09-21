// Middleware for protecting admin routes
import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(req) {
    // Additional middleware logic can be added here if needed
    console.log('Middleware - Path:', req.nextUrl.pathname)
    console.log('Middleware - Token role:', req.nextauth.token?.role)
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        console.log('Middleware authorized check - Path:', req.nextUrl.pathname)
        console.log('Middleware authorized check - Token:', token ? 'exists' : 'null')
        console.log('Middleware authorized check - Token role:', token?.role)
        
        // Allow access to login page without authentication
        if (req.nextUrl.pathname === '/admin/login') {
          console.log('Allowing access to login page')
          return true
        }
        
        // Protect other admin routes
        if (req.nextUrl.pathname.startsWith('/admin')) {
          const isAuthorized = token?.role === 'ADMIN' || token?.role === 'SUPER_ADMIN'
          console.log('Admin route authorization:', isAuthorized)
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
