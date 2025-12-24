// Clearance: Show spinner while /news categories load
export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-accent border-r-transparent" />
      <p className="mt-6 text-muted-foreground text-sm tracking-wide uppercase">
        Loading Tech News…
      </p>
    </div>
  )
}

