import { Card, CardContent } from "@/components/ui/card"
import { Shield, Lightbulb, Eye, Zap } from "lucide-react"

const values = [
  {
    icon: Shield,
    title: "Integrity First",
    description:
      "We maintain the highest standards of journalistic integrity, ensuring our content is accurate, unbiased, and trustworthy.",
    color: "text-blue-400",
  },
  {
    icon: Lightbulb,
    title: "Innovation Focus",
    description:
      "We spotlight groundbreaking technologies and innovative solutions that are shaping the future of our digital world.",
    color: "text-yellow-400",
  },
  {
    icon: Eye,
    title: "Transparency",
    description:
      "We believe in open, honest communication about our reporting process, sources, and potential conflicts of interest.",
    color: "text-green-400",
  },
  {
    icon: Zap,
    title: "Speed & Quality",
    description:
      "We deliver breaking news quickly without compromising on quality, ensuring you stay ahead of the curve.",
    color: "text-purple-400",
  },
]

export function AboutValues() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Core <span className="text-accent">Values</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              The principles that guide everything we do at ByteBrief
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value) => (
              <Card
                key={value.title}
                className="group hover:shadow-lg transition-all duration-300 bg-card border-border hover:border-primary/50"
              >
                <CardContent className="p-8 space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <value.icon className={`h-6 w-6 ${value.color}`} />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-accent transition-colors">
                      {value.title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
