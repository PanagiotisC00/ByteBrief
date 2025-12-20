# ByteBrief Markdown Guide

Concise steps for writing clean Markdown posts for the blog.

## Headings & structure
- One `#` H1 for the title; use `##` and `###` for sections/subsections.
- Blank line between paragraphs.

## Text emphasis
- Bold: `**text**`; Italic: `_text_`; Inline code: `` `code` ``.

## Lists
- Bullets: `- item` (indent two spaces to nest).
- Numbered: `1. item`.

## Links & images
- Link: `[text](https://example.com)`
- Image: `![alt text](https://image-url)` (use HTTPS, add descriptive alt).

## Code
``````
```language
const x = 1
```
``````
Use a language tag (`js`, `ts`, `bash`, `json`, etc.).

## Blockquotes
- `> Quote or note here`

## Tables (GFM)
```
| Column | Details |
| --- | --- |
| A | Item A |
| B | Item B |
```
- Keep headers short; check preview for alignment.

## Sources / references
```
Sources:
- [Link text](https://example.com)
- [Another](https://example.com)
```

## Do’s / Don’ts
- Do: short paragraphs, scannable lists, descriptive links, alt text.
- Do: use code blocks for snippets; tables for structured data.
- Don’t: giant code dumps; avoid raw HTML unless necessary.

## Optional front-matter
```
---
title: "Your Title"
excerpt: "One-line summary"
---
```
(Use only if needed; the admin UI may set metadata separately.)

## Final checks
- Only one H1; logical heading structure.
- Links work; no placeholders.
- Tables render cleanly; no empty `<p></p>`.
- Trim trailing whitespace.

