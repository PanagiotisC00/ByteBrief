// Blog content renderer with auto-detection for HTML/Markdown
'use client'

import DOMPurify from 'dompurify'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'

interface BlogContentProps {
    content: string
}

export function BlogContent({ content }: BlogContentProps) {
    const normalized = content.trim()

    // If content is empty/whitespace, render nothing to avoid empty paragraphs
    if (!normalized) {
        return null
    }

    // Auto-detect if content is HTML (from rich text editor)
    // Check for common HTML tags that TipTap generates
    const isHTML = /<(p|div|h[1-6]|ul|ol|li|blockquote|strong|em|a|br)\b[^>]*>/i.test(normalized)

    if (isHTML) {
        // Clearance: sanitize rich-text HTML before rendering to prevent XSS from stored content
        const sanitized = DOMPurify.sanitize(normalized, {
            USE_PROFILES: { html: true },
            FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],
        })

        // Render as HTML (from rich text editor)
        return (
            <div
                className="blog-content text-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ __html: sanitized }}
            />
        )
    }

    // Render as Markdown with math support
    // Clearance: guard against malformed markdown/latex crashing the whole post page
    try {
    return (
        <div className="blog-content text-foreground leading-relaxed markdown-content">
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkBreaks, [remarkMath, { singleDollarTextMath: false }]]}
                rehypePlugins={[[rehypeKatex, { throwOnError: false }]] as any}
            >
                {normalized}
            </ReactMarkdown>
        </div>
    )
    } catch (error) {
        console.error('Failed to render blog content:', error)
        return (
            <div className="blog-content text-foreground leading-relaxed">
                <p className="text-muted-foreground">
                    This article contains formatting that your device/browser could not render.
                </p>
                <pre className="mt-4 whitespace-pre-wrap break-words rounded-md border border-border bg-card p-4 text-sm">
                    {normalized}
                </pre>
            </div>
        )
    }
}
