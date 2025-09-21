// NextAuth configuration for ByteBrief admin authentication
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { prisma } from './prisma'
import { compare } from 'bcryptjs'
import type { UserRole } from '@prisma/client'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string | null
      role: UserRole
      avatar: string | null
    }
  }

  interface User {
    id: string
    email: string
    name: string | null
    role: UserRole
    avatar: string | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: UserRole
    id: string
  }
}

export const authOptions: NextAuthOptions = {
  // Reduce cookie size to prevent HTTP 431 errors
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 30 * 24 * 60 * 60 // 30 days
      }
    }
  },
  
  providers: [
    // Google OAuth for admin login
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'email profile', // Minimal scopes to reduce header size
        }
      }
    }),
    
    // Email/password authentication
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user || !user.password) {
          return null
        }

        const isValid = await compare(credentials.password, user.password)

        if (!isValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar
        }
      }
    })
  ],
  
  session: {
    strategy: 'jwt'
  },
  
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        // Check if user is authorized admin
        const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(email => email.trim()) || []
        
        if (!adminEmails.includes(user.email!)) {
          return false // Deny access if not in admin list
        }

        try {
          // Create or update user in database
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! }
          })

          if (!existingUser) {
            const newUser = await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name,
                avatar: user.image,
                role: 'ADMIN'
              }
            })
            // Update the user object with database info
            user.id = newUser.id
            user.role = newUser.role
          } else {
            // Update existing user
            const updatedUser = await prisma.user.update({
              where: { id: existingUser.id },
              data: {
                name: user.name,
                avatar: user.image
              }
            })
            user.id = updatedUser.id
            user.role = updatedUser.role
          }
        } catch (error) {
          console.error('Database error during sign in:', error)
          return false
        }
      }
      
      return true
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      } else if (token.email && !token.role) {
        // Fetch user data from database if not in token
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email }
        })
        if (dbUser) {
          token.id = dbUser.id
          token.role = dbUser.role
        }
      }
      
      return token
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id || token.sub!
        session.user.role = token.role
      }
      
      return session
    }
  },

  pages: {
    signIn: '/admin/login',
    error: '/admin/error'
  },

  secret: process.env.NEXTAUTH_SECRET
}
