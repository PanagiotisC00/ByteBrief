// Admin navigation component
'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { LoadingLink } from '@/components/ui/loading-link'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  FileText, 
  FolderOpen, 
  Tag, 
  BarChart3, 
  LogOut,
  User,
  Code2,
  Menu,
  X
} from 'lucide-react'

export function AdminNavigation() {
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: BarChart3 },
    { href: '/admin/posts', label: 'Posts', icon: FileText },
    { href: '/admin/categories', label: 'Categories', icon: FolderOpen },
    { href: '/admin/tags', label: 'Tags', icon: Tag },
  ]

  return (
    <nav className="fixed top-0 w-full bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 border-b border-border z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <LoadingLink href="/admin" className="flex items-center space-x-2 group" loadingLabel="Loading admin.">
            <Code2 className="h-8 w-8 text-primary group-hover:text-accent transition-colors" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              ByteBrief Admin
            </span>
          </LoadingLink>

          {/* Desktop Navigation Items */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <LoadingLink
                  key={item.href}
                  href={item.href}
                  loadingLabel={`Loading ${item.label.toLowerCase()}.`}
                  className="flex items-center space-x-1 text-muted-foreground hover:text-accent transition-colors font-medium"
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </LoadingLink>
              )
            })}
          </div>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/" target="_blank" rel="noopener noreferrer">View Site</Link>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span className="hidden md:block">{session?.user?.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem 
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="flex items-center text-destructive focus:text-destructive"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-card/95 backdrop-blur">
            <div className="px-4 py-3 space-y-3">
              {/* Mobile Navigation Items */}
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <LoadingLink
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    loadingLabel={`Loading ${item.label.toLowerCase()}.`}
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-accent hover:bg-muted/50 transition-colors font-medium"
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </LoadingLink>
                )
              })}
              
              {/* Mobile User Actions */}
              <div className="pt-3 border-t border-border space-y-2">
                <Link
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-accent hover:bg-muted/50 transition-colors font-medium"
                >
                  <Code2 className="h-5 w-5" />
                  <span>View Site</span>
                </Link>
                
                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    signOut({ callbackUrl: '/' })
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors font-medium"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </div>
              
              {/* Mobile User Info */}
              <div className="pt-3 border-t border-border">
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  Signed in as <span className="font-medium text-foreground">{session?.user?.name}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
