import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ComingSoon } from "@/components/coming-soon"

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        <ComingSoon />
      </main>
      <Footer />
    </div>
  )
}
