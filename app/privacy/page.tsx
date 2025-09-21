import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>
            <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
              <p className="text-muted-foreground mb-8">
                Last updated: {new Date().toLocaleDateString()}
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Information We Collect</h2>
                <p className="text-foreground leading-relaxed mb-4">
                  ByteBrief is a tech news blog that aggregates and curates publicly available technology news and information. 
                  We collect minimal information to provide our service:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-foreground">
                  <li>Basic analytics data to understand how visitors use our site (page views, session duration)</li>
                  <li>Email addresses for administrative contact (only when voluntarily provided)</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">How We Use Information</h2>
                <p className="text-foreground leading-relaxed mb-4">
                  Any information collected is used solely to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-foreground">
                  <li>Improve our content and user experience</li>
                  <li>Respond to inquiries or feedback</li>
                  <li>Monitor site performance and traffic</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Content Sourcing</h2>
                <p className="text-foreground leading-relaxed mb-4">
                  All news content on ByteBrief is sourced from publicly available information on the internet. 
                  We provide original source links for transparency and proper attribution. We do not claim ownership 
                  of the original news content.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Third-Party Services</h2>
                <p className="text-foreground leading-relaxed mb-4">
                  We may use third-party services for analytics and site functionality. These services may collect 
                  information according to their own privacy policies.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Contact</h2>
                <p className="text-foreground leading-relaxed">
                  If you have questions about this Privacy Policy, contact us at:{" "}
                  <a href="mailto:bytebriefblog@gmail.com" className="text-accent hover:underline">
                    bytebriefblog@gmail.com
                  </a>
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
