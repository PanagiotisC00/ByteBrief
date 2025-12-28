// Clearance: show immediate feedback between click and route-level loading.tsx
'use client'

import { createContext, useContext, useMemo, useState, useCallback, useEffect } from 'react'
import type { PropsWithChildren } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

const DEFAULT_MESSAGE = 'Loading content…'

type NavigationFeedbackContextValue = {
  startNavigation: (message?: string) => void
  finishNavigation: () => void
}

const NavigationFeedbackContext = createContext<NavigationFeedbackContextValue | null>(null)

export function NavigationFeedbackProvider({ children }: PropsWithChildren) {
  const [overlayState, setOverlayState] = useState<{ active: boolean; message: string }>({
    active: false,
    message: DEFAULT_MESSAGE,
  })
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const startNavigation = useCallback((message?: string) => {
    setOverlayState({
      active: true,
      message: message?.trim() || DEFAULT_MESSAGE,
    })
  }, [])

  const finishNavigation = useCallback(() => {
    setOverlayState((prev) => (prev.active ? { ...prev, active: false } : prev))
  }, [])

  const value = useMemo(
    () => ({
      startNavigation,
      finishNavigation,
    }),
    [startNavigation, finishNavigation]
  )

  const locationKey = `${pathname || '/'}?${searchParams?.toString() ?? ''}`

  useEffect(() => {
    finishNavigation()
  }, [locationKey, finishNavigation])

  return (
    <NavigationFeedbackContext.Provider value={value}>
      {children}
      {overlayState.active && (
        <div className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-background">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-accent border-r-transparent" />
          <p className="mt-4 text-sm tracking-wide text-muted-foreground uppercase">{overlayState.message}</p>
        </div>
      )}
    </NavigationFeedbackContext.Provider>
  )
}

export function useNavigationFeedback() {
  const ctx = useContext(NavigationFeedbackContext)
  if (!ctx) {
    throw new Error('useNavigationFeedback must be used within NavigationFeedbackProvider')
  }
  return ctx
}

