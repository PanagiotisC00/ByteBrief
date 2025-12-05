// Blog content renderer with auto-detection for HTML/Markdown
'use client'

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
    // Auto-detect if content is HTML (from rich text editor)
    // Check for common HTML tags that TipTap generates
    const isHTML = /<(p|div|h[1-6]|ul|ol|li|blockquote|strong|em|a|br)\b[^>]*>/i.test(content)

    if (isHTML) {
        // Render as HTML (from rich text editor)
        return (
            <div
                className="blog-content text-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ __html: content }}
            />
        )
    }

    // Render as Markdown with math support
    return (
        <div className="blog-content text-foreground leading-relaxed markdown-content">
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkBreaks, [remarkMath, { singleDollarTextMath: false }]]}
                rehypePlugins={[rehypeKatex]}
            >
                {content}
            </ReactMarkdown>
        </div>
    )
}
