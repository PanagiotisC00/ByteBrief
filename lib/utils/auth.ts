// Authentication utility functions
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { UserRole } from '@prisma/client'

// Get current session on server side
export async function getCurrentSession() {
  return await getServerSession(authOptions)
}

// Check if user is admin
export async function isAdmin(): Promise<boolean> {
  const session = await getCurrentSession()
  return session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN'
}

// Check if user has specific role or higher
export async function hasRole(requiredRole: UserRole): Promise<boolean> {
  const session = await getCurrentSession()
  
  if (!session?.user?.role) return false
  
  const roleHierarchy = {
    USER: 0,
    ADMIN: 1,
    SUPER_ADMIN: 2
  }
  
  return roleHierarchy[session.user.role] >= roleHierarchy[requiredRole]
}

// Require admin access (throw error if not authorized)
export async function requireAdmin() {
  const admin = await isAdmin()
  
  if (!admin) {
    throw new Error('Admin access required')
  }
  
  return await getCurrentSession()
}
