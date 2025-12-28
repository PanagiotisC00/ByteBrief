import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, ArrowLeft } from "lucide-react"
import { LoadingLink } from "@/components/ui/loading-link"

interface ComingSoonProps {
  title?: string
  description?: string
  feature?: string
}

export function ComingSoon({ 
  title = "Coming Soon", 
  description = "We're working hard to bring you something amazing. Stay tuned!",
  feature = "This feature"
}: ComingSoonProps) {
  return (
    <section className="py-20 bg-gradient-to-br from-background via-background to-card">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-accent/10 border border-accent/20">
            <Clock className="h-12 w-12 text-accent" />
          </div>

          {/* Content */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-balance leading-tight">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {title}
              </span>
            </h1>
            <p className="text-xl text-muted-foreground text-pretty leading-relaxed">
              {description}
            </p>
          </div>

          {/* Status Card */}
          <Card className="bg-gradient-to-br from-accent/5 to-primary/5 border-accent/20">
            <CardContent className="p-8 text-center">
              <div className="space-y-4">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
                  <Clock className="h-4 w-4 text-accent mr-2" />
                  <span className="text-accent font-medium text-sm">In Development</span>
                </div>
                <p className="text-muted-foreground">
                  {feature} is currently under development. We&apos;re putting the finishing touches on it to ensure the best possible experience.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Back Button */}
          <div className="flex justify-center">
            <LoadingLink href="/" loadingLabel="Loading home…">
              <Button variant="outline" size="lg">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </LoadingLink>
          </div>
        </div>
      </div>
    </section>
  )
}
