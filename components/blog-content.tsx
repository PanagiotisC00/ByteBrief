// Blog content renderer with auto-detection for HTML/Markdown
'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface BlogContentProps {
    content: string
}

export function BlogContent({ content }: BlogContentProps) {
    // Auto-detect if content is HTML or plain text/markdown
    const isHTML = /<[a-z][\s\S]*>/i.test(content)

    if (isHTML) {
        // Render as HTML (from rich text editor)
        return (
            <div
                className="blog-content text-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ __html: content }}
            />
        )
    }

    // Render as Markdown (also handles plain text nicely)
    return (
        <div className="blog-content text-foreground leading-relaxed markdown-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
            </ReactMarkdown>
        </div>
    )
}
