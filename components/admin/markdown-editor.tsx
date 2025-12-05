// Markdown Editor component with live preview
'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

interface MarkdownEditorProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    className?: string
}

export function MarkdownEditor({
    value,
    onChange,
    placeholder = 'Write your content in Markdown...',
    className
}: MarkdownEditorProps) {
    const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write')

    return (
        <div className={cn("rounded-md border border-input bg-background overflow-hidden", className)}>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'write' | 'preview')}>
                <div className="flex items-center justify-between border-b border-input bg-muted/50 px-2">
                    <TabsList className="h-10 bg-transparent">
                        <TabsTrigger
                            value="write"
                            className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
                        >
                            Write
                        </TabsTrigger>
                        <TabsTrigger
                            value="preview"
                            className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
                        >
                            Preview
                        </TabsTrigger>
                    </TabsList>
                    <span className="text-xs text-muted-foreground">
                        Markdown supported
                    </span>
                </div>

                <TabsContent value="write" className="m-0">
                    <Textarea
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        className="min-h-[400px] border-0 rounded-none focus-visible:ring-0 resize-none font-mono text-sm"
                    />
                </TabsContent>

                <TabsContent value="preview" className="m-0">
                    <div className="min-h-[400px] p-4 prose prose-sm dark:prose-invert max-w-none overflow-auto markdown-preview">
                        {value ? (
                            <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                                {value}
                            </ReactMarkdown>
                        ) : (
                            <p className="text-muted-foreground italic">Nothing to preview</p>
                        )}
                    </div>
                </TabsContent>
            </Tabs>

            {/* Markdown cheatsheet hint */}
            {activeTab === 'write' && (
                <div className="border-t border-input bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                    <span className="font-medium">Tip:</span>{' '}
                    **bold** | *italic* | # Heading | - bullet | 1. numbered | [link](url) | `code`
                </div>
            )}
        </div>
    )
}

