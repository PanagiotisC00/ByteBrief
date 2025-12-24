import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Clock } from "lucide-react"
import Link from "next/link"
import { LoadingLink } from "@/components/ui/loading-link"

// X.com icon (Twitter equivalent)
const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

// Instagram icon
const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
)

const socialLinks = [
  { icon: XIcon, href: "https://x.com/ByteBriefTech", label: "X", handle: "@ByteBriefTech", isComingSoon: false },
  { icon: InstagramIcon, href: "/coming-soon", label: "Instagram", handle: "@bytebrief", isComingSoon: true },
]

export function ContactInfo() {
  return (
    <div className="space-y-6">
      {/* Email Contact */}
      <Card className="bg-gradient-to-br from-card via-card to-card/90 border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-2 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Get in Touch
            </CardTitle>
          </div>
          <p className="text-muted-foreground text-base leading-relaxed ml-5">
            Send us an email for any inquiries
          </p>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="relative p-6 rounded-lg bg-gradient-to-br from-primary/5 via-primary/3 to-accent/5 border border-primary/10 hover:border-primary/20 transition-all duration-300 overflow-hidden">
            <div className="flex items-start space-x-5">
              <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 flex items-center justify-center shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300">
                <Mail className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1 space-y-3 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="text-xl font-bold text-white">Email</h3>
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
                </div>
                <a 
                  href="mailto:bytebriefblog@gmail.com"
                  className="block text-base font-semibold text-white hover:text-white hover:underline transition-all duration-300 cursor-pointer break-all overflow-hidden"
                >
                  bytebriefblog@gmail.com
                </a>
                <div className="flex items-center space-x-2 pt-1">
                  <Clock className="h-4 w-4 text-accent flex-shrink-0" />
                  <p className="text-sm text-muted-foreground font-medium break-words">
                    Typically responds within 24 hours
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Media */}
      <Card className="bg-gradient-to-br from-card via-card to-card/90 border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-2 h-8 bg-gradient-to-b from-accent to-primary rounded-full"></div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              Follow Us
            </CardTitle>
          </div>
          <p className="text-muted-foreground text-base leading-relaxed ml-5">
            Stay connected on social media
          </p>
        </CardHeader>
        <CardContent className="space-y-4 pt-2">
          {socialLinks.map((social) => {
            const isInternal = social.href.startsWith("/")
            const LinkComponent = isInternal ? LoadingLink : Link
            const commonProps = {
              key: social.label,
              href: social.href,
              className:
                "flex items-center p-4 rounded-lg bg-gradient-to-br from-accent/5 via-accent/3 to-primary/5 border border-accent/10 hover:border-accent/30 hover:shadow-md transition-all duration-300 group overflow-hidden",
            }
            return (
              <LinkComponent
                {...commonProps}
                {...(isInternal ? { loadingLabel: "Loading content…" } : {})}
              >
                <div className="flex items-center space-x-4 min-w-0 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 border border-accent/20 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300 flex-shrink-0">
                    <social.icon className="h-6 w-6 text-white transition-colors duration-300" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-white text-lg transition-colors duration-300">
                        {social.label}
                      </p>
                      {social.isComingSoon && (
                        <Badge variant="secondary" className="bg-accent/15 text-accent text-xs font-semibold border border-accent/20 ml-2">
                          Coming Soon
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-white/80 font-medium mt-1 break-words">{social.handle}</p>
                  </div>
                </div>
              </LinkComponent>
            )
          })}
        </CardContent>
      </Card>

      {/* Email Tips */}
      <Card className="bg-gradient-to-br from-card via-card to-card/90 border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-2 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Email Tips
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-2">
          <div className="space-y-4">
            <div className="flex items-start space-x-4 p-4 rounded-lg bg-gradient-to-r from-accent/5 to-primary/5 border border-accent/10">
              <Badge variant="secondary" className="bg-accent/20 text-accent border border-accent/30 text-xs font-bold px-3 py-1 mt-1 shadow-sm">
                Tip
              </Badge>
              <p className="text-sm text-foreground font-medium leading-relaxed">
                Include a clear subject line to help us categorize and respond to your email faster.
              </p>
            </div>
          <div className="flex items-start space-x-4 p-4 rounded-lg bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10">
            <Badge variant="secondary" className="bg-slate-100 text-slate-800 border border-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700 text-xs font-bold px-3 py-1 mt-1 shadow-sm">
              Story Tips
            </Badge>
            <p className="text-sm text-foreground font-medium leading-relaxed">
              For news tips, include relevant links and sources to help us verify information.
            </p>
          </div>
            <div className="flex items-start space-x-4 p-4 rounded-lg bg-gradient-to-r from-accent/5 to-primary/5 border border-accent/10">
              <Badge variant="secondary" className="bg-accent/20 text-accent border border-accent/30 text-xs font-bold px-3 py-1 mt-1 shadow-sm">
                Fast Reply
              </Badge>
              <p className="text-sm text-foreground font-medium leading-relaxed">
                We aim to respond to all emails within 24 hours during business days.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
