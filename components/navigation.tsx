"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Code2 } from "lucide-react"
import { useNavigationFeedback } from "@/components/providers/navigation-feedback-provider"
import { LoadingLink } from "@/components/ui/loading-link"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const { finishNavigation } = useNavigationFeedback()

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    finishNavigation()
  }, [finishNavigation])

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/news", label: "Tech News" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <nav className="fixed top-0 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <LoadingLink href="/" loadingLabel="Loading home…" className="flex items-center space-x-2 group">
            <Code2 className="h-8 w-8 text-primary group-hover:text-accent transition-colors" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              ByteBrief
            </span>
          </LoadingLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <LoadingLink
                key={item.href}
                href={item.href}
                loadingLabel={item.href === '/' ? 'Loading home…' : item.href === '/news' ? 'Loading news feed…' : 'Loading content…'}
                className="text-foreground hover:text-accent transition-colors font-medium"
              >
                {item.label}
              </LoadingLink>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMounted && isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <LoadingLink
                  key={item.href}
                  href={item.href}
                  loadingLabel={item.href === '/' ? 'Loading home…' : item.href === '/news' ? 'Loading news feed…' : 'Loading content…'}
                  className="text-foreground hover:text-accent transition-colors font-medium px-4 py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </LoadingLink>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
