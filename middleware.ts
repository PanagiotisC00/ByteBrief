// Middleware for protecting admin routes
import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(req) {
    // Additional middleware logic can be added here if needed
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
          // Allow access if user has admin role or if token has email but no role (JWT sync issue)
          return token?.role === 'ADMIN' || token?.role === 'SUPER_ADMIN' || (token?.email && !token?.role)
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
