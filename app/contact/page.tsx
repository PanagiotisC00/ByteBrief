import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ContactHero } from "@/components/contact-hero"
import { ContactInfo } from "@/components/contact-info"
import { ContactFAQ } from "@/components/contact-faq"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        <ContactHero />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <ContactInfo />
          </div>
        </div>
        <ContactFAQ />
      </main>
      <Footer />
    </div>
  )
}
