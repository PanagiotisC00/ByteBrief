// Clearance: link wrapper that toggles navigation overlay instantly
'use client'

import Link from 'next/link'
import type { LinkProps } from 'next/link'
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from 'react'
import { forwardRef, useMemo } from 'react'
import { usePathname } from 'next/navigation'
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

  const isSameRoute = useMemo(() => {
    const normalize = (value?: string | null) => {
      if (!value) return null
      const cleaned = value.split('#')[0]?.split('?')[0] || '/'
      if (cleaned === '/') return '/'
      return cleaned.replace(/\/+$/, '') || '/'
    }

    const target =
      typeof props.href === 'string'
        ? normalize(props.href)
        : normalize(props.href?.pathname?.toString() ?? null)
    const current = normalize(pathname)

    return Boolean(target && current && target === current)
  }, [pathname, props.href])

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
