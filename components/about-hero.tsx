import { Code2, Zap, Globe } from "lucide-react"

export function AboutHero() {
  return (
    <section className="bg-gradient-to-br from-background via-background to-card py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
              <Code2 className="h-5 w-5 text-accent mr-2" />
              <span className="text-accent font-medium">About ByteBrief</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-balance leading-tight">
              Empowering the{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Tech Community
              </span>
            </h1>
            <p className="text-xl text-muted-foreground text-pretty leading-relaxed max-w-3xl mx-auto">
              ByteBrief is your trusted source for cutting-edge technology news, insights, and analysis. We bridge the
              gap between complex tech developments and practical understanding for developers, entrepreneurs, and tech
              enthusiasts worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/20">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Fast & Accurate</h3>
              <p className="text-muted-foreground">Breaking news delivered with speed and precision</p>
            </div>
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 border border-accent/20">
                <Globe className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Global Perspective</h3>
              <p className="text-muted-foreground">Tech insights from around the world</p>
            </div>
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/20">
                <Code2 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Developer Focused</h3>
              <p className="text-muted-foreground">Content tailored for the tech community</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
