import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-foreground mb-8">Terms of Service</h1>
            <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
              <p className="text-muted-foreground mb-8">
                Last updated: {new Date().toLocaleDateString()}
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">About ByteBrief</h2>
                <p className="text-foreground leading-relaxed mb-4">
                  ByteBrief is a technology news blog that curates and presents publicly available tech news and information 
                  from various internet sources. We aim to provide timely and relevant technology insights to our readers.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Content and Sources</h2>
                <p className="text-foreground leading-relaxed mb-4">
                  All news content published on ByteBrief is sourced from publicly available information found on the internet. 
                  We provide original source links for all articles to ensure proper attribution and transparency.
                </p>
                <ul className="list-disc pl-6 space-y-2 text-foreground">
                  <li>We do not claim ownership of original news content</li>
                  <li>Original source links are provided for all curated content</li>
                  <li>Content is aggregated for informational purposes</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Use of Service</h2>
                <p className="text-foreground leading-relaxed mb-4">
                  By using ByteBrief, you agree to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-foreground">
                  <li>Use the service for personal, informational purposes</li>
                  <li>Not republish our curated content without permission</li>
                  <li>Respect the original sources and their terms</li>
                  <li>Not attempt to harm or disrupt the service</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Disclaimer</h2>
                <p className="text-foreground leading-relaxed mb-4">
                  ByteBrief provides content "as is" for informational purposes. We make no warranties about the 
                  accuracy, completeness, or reliability of any content. We are not responsible for the content 
                  of external sites linked from our articles.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Changes to Terms</h2>
                <p className="text-foreground leading-relaxed mb-4">
                  We may update these terms occasionally. Continued use of the service constitutes acceptance of any changes.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Contact</h2>
                <p className="text-foreground leading-relaxed">
                  Questions about these terms? Contact us at:{" "}
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
