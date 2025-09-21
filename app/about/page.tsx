import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { AboutHero } from "@/components/about-hero"
import { AboutMission } from "@/components/about-mission"
import { AboutValues } from "@/components/about-values"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        <AboutHero />
        <AboutMission />
        <AboutValues />
      </main>
      <Footer />
    </div>
  )
}
