// Admin layout with navigation
import { AdminNavigation } from '@/components/admin/admin-navigation'
import { SessionProvider } from '@/components/providers/session-provider'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Middleware handles authentication, no need to check here
  return (
    <SessionProvider>
      <div className="min-h-screen bg-background">
        <AdminNavigation />
        <main className="pt-16">
          {children}
        </main>
      </div>
    </SessionProvider>
  )
}
