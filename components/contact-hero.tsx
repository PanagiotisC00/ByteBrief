import { Mail, Clock, MessageCircle } from "lucide-react"
import Link from "next/link"

// X.com icon (Twitter equivalent)
const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

// Instagram icon
const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
)

export function ContactHero() {
  return (
    <section className="bg-gradient-to-br from-background via-background to-card py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
              <MessageCircle className="h-5 w-5 text-accent mr-2" />
              <span className="text-accent font-medium">Get in Touch</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-balance leading-tight">
              Let's Start a{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Conversation
              </span>
            </h1>
            <p className="text-xl text-muted-foreground text-pretty leading-relaxed max-w-3xl mx-auto">
              Have a story tip, feedback, or want to collaborate? We'd love to hear from you. Our team is always ready
              to connect with the tech community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {/* Email - Clickable mailto link */}
            <a
              href="mailto:bytebriefblog@gmail.com"
              className="text-center space-y-4 p-6 rounded-lg hover:bg-gradient-to-br hover:from-primary/10 hover:to-primary/5 hover:shadow-lg hover:scale-105 transition-all duration-500 group cursor-pointer border border-transparent hover:border-primary/30"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/20 group-hover:bg-primary/30 group-hover:border-primary/40 group-hover:shadow-lg transition-all duration-500">
                <Mail className="h-8 w-8 text-white group-hover:scale-125 transition-all duration-500" />
              </div>
              <h3 className="text-xl font-semibold text-white group-hover:scale-105 transition-all duration-500">Email Us</h3>
              <p className="text-white/80 transition-all duration-500">bytebriefblog@gmail.com</p>
            </a>

            {/* X (Twitter) - Clickable link to coming soon */}
            <Link
              href="/coming-soon"
              className="text-center space-y-4 p-6 rounded-lg hover:bg-gradient-to-br hover:from-accent/10 hover:to-accent/5 hover:shadow-lg hover:scale-105 transition-all duration-500 group cursor-pointer border border-transparent hover:border-accent/30"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 border border-accent/20 group-hover:bg-accent/30 group-hover:border-accent/40 group-hover:shadow-lg transition-all duration-500">
                <XIcon className="h-8 w-8 text-accent group-hover:scale-125 group-hover:text-white transition-all duration-500" />
              </div>
              <div className="flex items-center justify-center gap-2">
                <h3 className="text-xl font-semibold text-foreground group-hover:text-accent group-hover:scale-105 transition-all duration-500">X</h3>
                <div className="inline-flex items-center px-2 py-1 rounded-full bg-accent/10 border border-accent/20 group-hover:bg-accent/20 group-hover:border-accent/30 transition-all duration-500">
                  <Clock className="h-3 w-3 text-accent mr-1 group-hover:scale-110 transition-all duration-500" />
                  <span className="text-accent text-xs font-medium">Coming Soon</span>
                </div>
              </div>
              <p className="text-muted-foreground group-hover:text-accent/80 transition-all duration-500">Follow us for tech updates and news</p>
            </Link>

            {/* Instagram - Clickable link to coming soon */}
            <Link
              href="/coming-soon"
              className="text-center space-y-4 p-6 rounded-lg hover:bg-gradient-to-br hover:from-primary/10 hover:to-primary/5 hover:shadow-lg hover:scale-105 transition-all duration-500 group cursor-pointer border border-transparent hover:border-primary/30"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/20 group-hover:bg-primary/30 group-hover:border-primary/40 group-hover:shadow-lg transition-all duration-500">
                <InstagramIcon className="h-8 w-8 text-white group-hover:scale-125 transition-all duration-500" />
              </div>
              <div className="flex items-center justify-center gap-2">
                <h3 className="text-xl font-semibold text-white group-hover:scale-105 transition-all duration-500">Instagram</h3>
                <div className="inline-flex items-center px-2 py-1 rounded-full bg-accent/10 border border-accent/20 group-hover:bg-accent/20 group-hover:border-accent/30 transition-all duration-500">
                  <Clock className="h-3 w-3 text-accent mr-1 group-hover:scale-110 transition-all duration-500" />
                  <span className="text-accent text-xs font-medium">Coming Soon</span>
                </div>
              </div>
              <p className="text-white/80 transition-all duration-500">Behind the scenes and visual content</p>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
