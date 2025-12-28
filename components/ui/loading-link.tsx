// Clearance: link wrapper that toggles navigation overlay instantly
'use client'

import Link from 'next/link'
import type { LinkProps } from 'next/link'
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from 'react'
import { forwardRef, useMemo } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useNavigationFeedback } from '@/components/providers/navigation-feedback-provider'

type LoadingLinkProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
    children: ReactNode
    loadingLabel?: string
  }

export const LoadingLink = forwardRef<HTMLAnchorElement, LoadingLinkProps>(function LoadingLink(
  { onClick, children, loadingLabel, ...props },
  ref
) {
  const { startNavigation } = useNavigationFeedback()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const searchParamsString = searchParams?.toString() ?? ''

  const isSameRoute = useMemo(() => {
    const normalize = (path: string, search: string) => {
      const cleanedPath = path === '/' ? '/' : path.replace(/\/+$/, '') || '/'
      return `${cleanedPath}${search}`
    }

    const current = normalize(pathname || '/', searchParamsString ? `?${searchParamsString}` : '')

    let targetPath = ''
    let targetSearch = ''

    if (typeof props.href === 'string') {
      try {
        const url = new URL(props.href, typeof window !== 'undefined' ? window.location.origin : 'http://localhost')
        targetPath = url.pathname
        targetSearch = url.search
      } catch {
        targetPath = props.href
        targetSearch = ''
      }
    } else if (typeof props.href === 'object' && props.href !== null) {
      const path = typeof props.href.pathname === 'string' ? props.href.pathname : pathname || '/'
      let search = ''
      if (typeof props.href.search === 'string') {
        search = props.href.search
      } else if (props.href.query) {
        const searchParams = new URLSearchParams()
        Object.entries(props.href.query).forEach(([key, value]) => {
          if (value == null) return
          searchParams.set(key, String(value))
        })
        const built = searchParams.toString()
        search = built ? `?${built}` : ''
      }
      targetPath = path
      targetSearch = search
    }

    return targetPath ? normalize(targetPath, targetSearch) === current : false
  }, [pathname, props.href, searchParamsString])

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.altKey ||
      event.ctrlKey ||
      event.shiftKey
    ) {
      onClick?.(event)
      return
    }

    if (isSameRoute) {
      onClick?.(event)
      return
    }

    startNavigation(loadingLabel)
    onClick?.(event)
  }

  return (
    <Link {...props} ref={ref} onClick={handleClick}>
      {children}
    </Link>
  )
})
