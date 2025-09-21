"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown, ChevronUp } from "lucide-react"

const faqs = [
  {
    question: "How can I submit a story tip or news lead?",
    answer:
      "Email us at bytebriefblog@gmail.com with your story tip. Please include relevant links, sources, and any supporting information to help us verify and investigate the story quickly. Use 'Story Tip' in your subject line.",
  },
  {
    question: "Do you accept guest articles or contributions?",
    answer:
      "Currently, ByteBrief publishes content created by our editorial team to maintain consistent quality and voice. However, we're always open to expert insights and quotes for our articles. Contact us if you're an industry expert willing to provide commentary.",
  },
  {
    question: "How can I advertise or partner with ByteBrief?",
    answer:
      "For advertising opportunities and partnerships, please email us at bytebriefblog@gmail.com with 'Partnership' in the subject line. Include details about your company, campaign goals, and preferred collaboration type.",
  },
  {
    question: "What's your typical response time?",
    answer:
      "We aim to respond to all emails within 24 hours during business days. Breaking news tips and urgent press inquiries typically receive faster responses. Please be patient as we review each email carefully.",
  },
  {
    question: "Can I request corrections or updates to published articles?",
    answer:
      "Absolutely. We prioritize accuracy and transparency in our reporting. Email us with specific details about any errors, including the article URL and the correct information with supporting sources. We'll review and update articles promptly when needed.",
  },
  {
    question: "How do I stay updated with ByteBrief's latest content?",
    answer:
      "Currently, the best way to stay updated is by bookmarking our website and visiting regularly. We're working on social media channels (X and Instagram) that will be available soon for additional updates and engagement.",
  },
]

export function ContactFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-20 bg-card/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked <span className="text-accent">Questions</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Find quick answers to common questions about contacting ByteBrief
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="bg-card border-border">
                <CardContent className="p-0">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-background/50 transition-colors"
                  >
                    <h3 className="text-lg font-semibold text-foreground pr-4">{faq.question}</h3>
                    {openIndex === index ? (
                      <ChevronUp className="h-5 w-5 text-accent flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    )}
                  </button>
                  {openIndex === index && (
                    <div className="px-6 pb-6">
                      <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
