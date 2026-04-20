# AGENTS.md

This file gives coding agents project-specific operating instructions for ByteBrief. It follows the AGENTS.md convention: a predictable Markdown file at the repository root with setup, workflow, style, testing, and safety guidance for agents working in this codebase. Reference: https://agents.md/

## Project Context

- Product: ByteBrief, a modern tech blog with public article/category/tag pages and an authenticated admin area for managing posts, categories, tags, and uploads.
- Framework: Next.js 14 App Router with React 18 and TypeScript strict mode.
- Runtime model: React Server Components by default, Client Components only where interactivity or browser APIs are required.
- Database: PostgreSQL accessed through Prisma ORM.
- Authentication: NextAuth v4 with Google OAuth and admin email allowlisting.
- Styling: Tailwind CSS, Radix UI primitives, shadcn-style component organization, Framer Motion for selected motion.
- Package manager: npm, with `package-lock.json` committed.
- Platform assumption: Windows workspace using PowerShell unless the user explicitly requests WSL or another shell.

## Repository Map

- `app\` - Next.js App Router pages, layouts, loading/error UI, metadata routes, and API route handlers.
- `app\api\` - server-only API route handlers using `NextRequest` and `NextResponse`.
- `app\admin\` - admin dashboard pages and server-side auth gates.
- `components\` - reusable React components.
- `components\admin\` - admin forms, tables, rich text/markdown editors, and upload UI.
- `components\ui\` - shared UI primitives. Follow the existing component API and styling patterns before introducing new primitives.
- `components\providers\` - client providers.
- `lib\` - application services, Prisma singleton, auth configuration, Supabase helpers, and blog data fetching.
- `lib\blog.ts` - core blog queries and slug/read-time helpers. Keep public query behavior consistent here.
- `lib\prisma.ts` - singleton Prisma client and pooler-friendly connection handling. Do not bypass it.
- `lib\auth.ts` and `lib\utils\auth.ts` - NextAuth configuration and session helpers.
- `prisma\schema.prisma` - canonical database schema.
- `prisma\seed.ts` - seed data entry point.
- `public\` - static assets and generated favicons.
- `styles\` and `app\globals.css` - global styling.

## Windows Environment And Tooling

- Default to PowerShell (`pwsh` or Windows PowerShell). Use backslashes in paths and quote paths with spaces.
- Prefer `rg` for content search and `fd` for file search. If unavailable, use `Get-ChildItem`.
- Use `Get-Content -Raw -Path <path>` for normal files. Use `-LiteralPath` for paths containing brackets, such as `app\blog\[slug]\page.tsx`.
- If WSL is explicitly requested, switch immediately to bash path and shell conventions.
- Package installs preference: `winget` > `choco` > `scoop` > project-local package manager commands.
- Keep CRLF vs LF in mind when editing config files. Prefer preserving existing line endings.
- Avoid destructive commands unless the user explicitly asks for them. Call out risk before `Remove-Item -Recurse`, database resets, forced pushes, or migration rewrites.

## Core Commands

- Install dependencies: `npm install`
- Start development server: `npm run dev`
- Production build: `npm run build`
- Start built app: `npm run start`
- Lint: `npm run lint`
- Generate Prisma client: `npm run _db:generate`
- Push schema to database: `npm run _db:push`
- Create local migration: `npm run _db:migrate`
- Seed database: `npm run _db:seed`
- Open Prisma Studio: `npm run _db:studio`
- Reset database: `npm run _db:reset`

## Command Safety

- `npm run build` runs `prisma generate` before `next build`; make sure database-related environment variables are present when the build needs Prisma.
- Treat scripts prefixed with `_db:` as intentionally visible but potentially sensitive. Confirm intent before running commands that modify or reset data.
- Never run `npm run _db:reset` without explicit user approval.
- Never run Prisma schema push or migrations against production unless the user explicitly confirms the target database and desired operation.
- Do not edit `.env` or `.env.local` values unless the user explicitly asks. If an environment value is missing, explain the required variable name without exposing existing secrets.
- Do not log secrets, OAuth credentials, database URLs, tokens, cookies, or admin emails.

## Environment Variables

Expected variables are documented by `env-template.txt`, `SETUP.md`, and `GOOGLE_OAUTH_SETUP.md`. Commonly relevant variables include:

- `DATABASE_URL` - Prisma/PostgreSQL connection URL.
- `DIRECT_URL` - direct database URL for Prisma migrations or direct connections.
- `NEXTAUTH_SECRET` - NextAuth signing secret.
- `NEXTAUTH_URL` - canonical app URL for auth callbacks.
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` - Google OAuth credentials.
- `ADMIN_EMAILS` - comma-separated allowlist for admin sign-in.
- Supabase-related variables if working in `lib\supabase\`.

Rules:

- Read environment templates and docs before adding new variables.
- Validate required server environment variables at server boundaries, not in Client Components.
- Never expose server-only variables through `NEXT_PUBLIC_` unless the value is intentionally public.
- If adding a new variable, update `env-template.txt` and setup documentation in the same change.

## Standard Workflow For Agents

1. Read the nearest `AGENTS.md` first. The closest file wins if nested instructions are added later.
2. Inspect relevant files before editing. Do not infer architecture from package names alone.
3. Check `git status --short` before changing files. Treat unrelated changes as user work and leave them alone.
4. Make narrowly scoped edits that fit existing patterns.
5. Add or update tests when the repo has a suitable test surface, or document the gap if no test harness exists.
6. Run the smallest useful checks first, then broader checks for risky changes.
7. Finish with a concise summary of changed files, checks run, and any residual risk.

## Current Verification Baseline

- There is no dedicated `test` script in `package.json`.
- For most code changes, run `npm run lint`.
- For changes that affect routing, Prisma, auth, config, or data fetching, run `npm run build` when environment variables allow it.
- For Prisma schema changes, run `npm run _db:generate` and the appropriate migration command after confirming database intent.
- For documentation-only changes, no build is required unless the user asks.

## TypeScript Standards

- Keep `strict: true` green. Do not weaken TypeScript compiler options to make code pass.
- Prefer precise domain types over `any`. Use `unknown` at untrusted boundaries, then narrow with explicit validation.
- Use `import type` for type-only imports when practical.
- Prefer discriminated unions for state machines and API result variants.
- Keep exported function signatures stable and explicit when they cross module boundaries.
- Do not silence errors with `as any`, non-null assertions, or broad casts unless there is a clear runtime invariant. If a cast is unavoidable, keep it local and explain why.
- Prefer `const` and immutable data transformations unless mutation materially simplifies a local algorithm.
- Normalize and validate external input at the boundary: route handlers, form submit handlers, search params, webhook payloads, file uploads, and environment variables.
- Avoid duplicating generated Prisma model shapes manually when Prisma types can express the contract.
- Use `Prisma.*Input`, `Prisma.*Select`, and `Prisma.*Include` types where they prevent widening or make query contracts clearer.
- Keep shared utility functions pure where feasible. Side effects should be obvious from function names and call sites.
- Do not introduce global mutable state except for intentional cache/singleton patterns such as the Prisma client or small in-flight request dedupe caches.

## TypeScript Things To Avoid

- Do not disable lint or type rules globally.
- Do not widen precise values into `string`, `number`, or `boolean` when literal unions would preserve intent.
- Do not return inconsistent shapes from API helpers.
- Do not mix nullable and optional semantics casually. Use `undefined` for omitted inputs and `null` for persisted empty database values where the schema uses nullable columns.
- Do not trust `request.json()` shape without validation.
- Do not let server-only types leak into client bundles through imports from mixed modules.

## React Standards

- Default to Server Components in `app\` and server-oriented components. Add `'use client'` only when a component needs state, effects, event handlers, browser APIs, context providers, or client-side libraries.
- Keep Client Components small. Pass serialized data from Server Components into Client Components instead of importing server modules into client files.
- Use composition over prop drilling when it simplifies ownership, but avoid adding context for one-off state.
- Keep component props explicit and typed. Use narrow prop interfaces near the component unless shared across multiple files.
- Prefer controlled forms when validation, conditional UI, or submission state matters.
- Use React Hook Form and existing form conventions in admin forms where appropriate.
- Preserve accessibility: semantic HTML first, labels for inputs, meaningful alt text, keyboard-accessible controls, visible focus, and ARIA only when native semantics are insufficient.
- Keep loading and error states intentional. Use App Router `loading.tsx` and `error.tsx` where route-level behavior is appropriate.
- Prevent layout shift for images, cards, tables, and admin controls by defining dimensions or stable layout constraints.
- Use `next/image` when image optimization is useful and source constraints are compatible. Use existing fallback image components where the repo already handles remote failures.
- Sanitize rendered user-authored HTML or markdown. This repo uses libraries such as DOMPurify and React Markdown; keep sanitization in the rendering path for unsafe content.

## React Things To Avoid

- Do not add `'use client'` to a whole page or layout just to support one interactive child.
- Do not call server-only helpers, Prisma, NextAuth server helpers, or filesystem APIs from Client Components.
- Do not put async data fetching directly in Client Components unless there is a clear client-side refresh need.
- Do not use array indexes as keys for mutable lists.
- Do not hide accessibility problems behind custom div-based controls when Radix or native elements fit.
- Do not duplicate large chunks of JSX instead of extracting a focused component.
- Do not introduce animation that blocks interaction, harms accessibility, or causes layout instability.

## Next.js App Router Standards

- Use App Router conventions: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `route.ts`, `robots.ts`, and `sitemap.ts`.
- Prefer Server Components for page data fetching.
- Use `redirect()` and `notFound()` from `next/navigation` for server-side route control.
- Use `generateMetadata` for dynamic SEO metadata when page content varies by slug, category, or tag.
- Keep `searchParams` parsing defensive. Normalize page numbers, page sizes, sort keys, category slugs, and search strings.
- Use `revalidatePath` after mutations that affect cached public or admin pages.
- Be explicit about caching and revalidation when adding new fetches or route handlers.
- Keep route segment behavior predictable. Do not accidentally force dynamic rendering for static pages by importing request/session APIs unnecessarily.
- Prefer colocated route-level loading/error files for route-specific behavior.
- Preserve `next.config.mjs` security headers unless there is a clear reason to change them.

## Next.js Things To Avoid

- Do not import `next/headers`, `cookies()`, `headers()`, `getServerSession`, or Prisma into modules that must stay client-safe.
- Do not mix Pages Router patterns into `app\`.
- Do not use API routes for work that can remain as server-side component data fetching, unless there is a client or external caller.
- Do not forget to revalidate affected paths after admin mutations.
- Do not use broad remote image allowances as a reason to skip image validation in upload/admin flows.
- Do not create unnecessary middleware logic; middleware runs on many requests and should stay small.

## API Route Standards

- Place API handlers in `app\api\...\route.ts`.
- Use named exports for HTTP methods: `GET`, `POST`, `PATCH`, `PUT`, `DELETE`.
- Keep route handlers server-only and side-effect boundaries explicit.
- Authenticate admin routes with the existing session helper and check roles: `ADMIN` and `SUPER_ADMIN`.
- Return `NextResponse.json(...)` with appropriate status codes.
- Validate request bodies before writing to the database. Prefer Zod for non-trivial bodies because it is already available.
- Normalize strings before persistence: trim names, slugs, search text, URLs, alt text, and comma-separated sources.
- Use explicit allowlists for enum-like inputs such as post status, sort key, role, category filters, and upload type.
- Handle expected errors distinctly: unauthorized `401`, forbidden `403`, invalid input `400`, not found `404`, conflict `409`, and unexpected server error `500`.
- Log only operationally useful error context. Do not log full request bodies, secrets, cookies, tokens, or database URLs.
- After mutations, revalidate every affected path: public list pages, detail pages, admin tables, category/tag pages, homepage, and news/blog indexes.

## API Things To Avoid

- Do not trust client-provided `authorId` without confirming it matches the authenticated user or an authorized admin workflow.
- Do not expose raw Prisma errors to clients.
- Do not return entire user records unless every selected field is intentional.
- Do not accept arbitrary query parameters into Prisma `where`, `orderBy`, `include`, or `select` objects.
- Do not build SQL by string concatenation.
- Do not implement file upload endpoints without size, type, authentication, and storage-path checks.
- Do not make route handlers silently succeed on partial writes unless the behavior is deliberate and documented.

## PostgreSQL Standards

- Design schema changes with PostgreSQL behavior in mind: constraints, indexes, transactions, nullability, cascades, and lock impact.
- Add indexes for frequent filters, joins, and sort patterns. In this app that often means slugs, status, published date, category, tags, and admin list filters.
- Keep uniqueness in the database, not only in application code. Slugs, category names, tag names, and user emails should remain protected by unique constraints where required.
- Use transactions for multi-step writes that must remain consistent, such as post creation/update with tags.
- Prefer cursor or bounded pagination for large lists. Offset pagination is acceptable for small admin/public lists but should remain capped.
- Avoid unbounded `findMany` calls in public paths.
- Be careful with cascading deletes. `Post` cascades from `User`; `PostTag` cascades from `Post` and `Tag`; `Category` deletion is restricted by posts.
- Treat database timestamps as authoritative for persisted lifecycle events.
- Use nullable columns intentionally. If a field must be required in product behavior, enforce it at the API/form layer and, where possible, the schema layer.

## PostgreSQL Things To Avoid

- Do not run destructive DDL or data resets without explicit approval.
- Do not perform schema changes only through `db push` when a migration is needed for repeatable environments.
- Do not add required columns to populated tables without a migration plan and backfill/default strategy.
- Do not rely on application-side checks alone for uniqueness or referential integrity.
- Do not fetch large text fields, relations, or user records in list queries unless the UI needs them.
- Do not create N+1 query patterns in public pages.

## Prisma Standards

- Always import Prisma through `@/lib/prisma` or `lib\prisma.ts`; do not instantiate another `PrismaClient`.
- Keep `prisma\schema.prisma` as the source of truth for models and relationships.
- Run `npm run _db:generate` after schema changes.
- Use Prisma migrations for durable schema evolution. Use `db push` only for local prototyping when the user accepts that tradeoff.
- Prefer `select` for list queries and public responses. Use `include` only when the full relation data is actually needed.
- Keep query payloads skinny on public routes. Avoid returning `content` in card/list views when `excerpt` is enough.
- Use `connect`, `disconnect`, `set`, `create`, and nested writes intentionally for relationships.
- Wrap multi-table mutations in `prisma.$transaction` when partial success would corrupt state.
- Use generated enums such as `PostStatus` and `UserRole` instead of string literals where practical.
- Normalize slugs through shared helpers. Preserve `generateSlug` behavior unless intentionally changing slug rules.
- Understand connection limits. The existing Prisma singleton adjusts pooler-like URLs with `connection_limit` and `pool_timeout`; do not remove that behavior casually.
- In serverless-sensitive paths, avoid needless parallel Prisma queries if they increase connection pressure. The repo already has comments where sequential queries are intentional.
- For search, prefer indexed database-native approaches for large content. Current `contains` search is acceptable for small datasets but should not be scaled blindly.

## Prisma Things To Avoid

- Do not import `@prisma/client` into Client Components.
- Do not pass raw request query/body objects directly into Prisma.
- Do not use `include: true` style broad relation loading.
- Do not ignore `null` handling for optional database fields.
- Do not mask failed writes by catching and returning success.
- Do not add migrations that rewrite history after they have been shared.
- Do not use `$queryRawUnsafe`. If raw SQL is unavoidable, use parameterized `prisma.$queryRaw`.
- Do not run many Prisma calls in loops when a single relational query, `in` filter, transaction, or bulk operation would fit.

## Authentication And Authorization

- Admin access is Google OAuth based and allowlisted through `ADMIN_EMAILS`.
- Keep admin page guards on server pages using the existing session helper and `redirect('/admin/login')`.
- Keep admin API guards inside every admin route handler. Page protection alone is not enough.
- Check roles explicitly. Current privileged roles are `ADMIN` and `SUPER_ADMIN`.
- Do not assume the client is honest about user identity, author ID, role, post status, upload target, or ownership.
- Keep NextAuth session payload small. The code intentionally reduces cookie size to avoid large headers.
- Do not add extra OAuth scopes unless the feature requires them and the reason is documented.

## Security Standards

- Treat all user-authored content as untrusted, including markdown, rich text, image URLs, sources, titles, excerpts, slugs, and filenames.
- Sanitize HTML and markdown render paths.
- Validate uploaded file type, extension, size, and storage key/path.
- Keep security headers in `next.config.mjs` unless replacing them with stronger equivalents.
- Use least-privilege data selection for API responses.
- Use server-only environment variables for secrets.
- Avoid exposing implementation details in error responses.
- Rate limiting is not currently visible in the repo; consider it before adding public write endpoints or expensive public API routes.
- Be cautious with remote images. The config allows broad HTTPS remote patterns; admin/upload validation must compensate.

## Security Things To Avoid

- Do not leak `.env`, `.env.local`, cookies, OAuth tokens, session tokens, database URLs, or admin allowlists.
- Do not render raw HTML without sanitization.
- Do not accept arbitrary redirect URLs.
- Do not trust MIME type alone for uploads.
- Do not log full auth/session objects.
- Do not expose draft or archived posts on public pages.
- Do not weaken auth checks to simplify admin UI work.

## Styling And UI Standards

- Follow existing Tailwind conventions and component structure.
- Prefer existing `components\ui\` primitives before adding new primitives.
- Use Radix primitives for accessible complex controls.
- Keep styling cohesive with the current design system.
- Use `cn` from `lib\utils.ts` for conditional class composition where applicable.
- Keep class lists readable. Extract component variants with existing local patterns if a class list becomes hard to maintain.
- Maintain responsive behavior for mobile, tablet, and desktop.
- Use semantic spacing and layout primitives rather than one-off pixel tuning.
- Keep focus, hover, disabled, loading, and error states visible.
- Preserve dark/light theme compatibility if touching themed UI.

## Styling Things To Avoid

- Do not create parallel button/card/input systems when shared primitives already exist.
- Do not hardcode colors that should come from theme tokens unless it is an intentional brand asset.
- Do not make text unreadable over motion or image backgrounds.
- Do not remove focus outlines without replacing them with accessible focus styling.
- Do not introduce layout shifts in tables, grids, image cards, nav, or admin forms.

## Data Fetching And Caching

- Fetch public page data in Server Components or server utilities where possible.
- Keep public list queries bounded with `take`, normalized page size, and skinny `select`.
- Reuse `lib\blog.ts` helpers for blog/category/tag data unless a feature-specific query is clearly better.
- Revalidate affected paths after writes. Mutations to posts often affect `/`, `/blog`, `/news`, `/admin`, `/admin/posts`, category pages, tag pages, and the individual slug page.
- Be explicit when introducing `cache`, `no-store`, `revalidate`, or dynamic route behavior.
- Use small, intentional in-memory caches only when safe for the deployment model and data freshness requirements.

## Content And SEO

- Preserve metadata quality for public pages.
- Keep slugs stable. Changing slug behavior can break indexed URLs.
- Use meaningful `imageAlt` text for post images.
- Keep sitemap and robots behavior aligned with public route visibility.
- Do not expose drafts, archived posts, admin paths, private uploads, or preview-only content in SEO surfaces.
- Validate source URLs and external links when rendering article sources.

## Forms And Validation

- Use React Hook Form and existing admin form conventions where already established.
- Use Zod for reusable or non-trivial validation schemas.
- Validate on the server even if the client already validates.
- Trim and normalize form strings before persistence.
- Show actionable user-facing errors without exposing internal exceptions.
- Keep optimistic UI changes consistent with server truth.
- For rich text or markdown inputs, validate size and sanitize output paths.

## Error Handling

- Handle expected application errors close to the boundary.
- Use route-level `error.tsx` for user-facing route failures where appropriate.
- Return stable API error shapes such as `{ error: 'Message' }`.
- Keep internal error messages in logs, not client responses.
- Include enough server log context to debug without leaking secrets or full payloads.
- Do not swallow errors from writes, auth checks, uploads, or cache revalidation.

## Performance Standards

- Avoid large client bundles. Keep heavy editors, charts, and animation libraries out of routes that do not need them.
- Prefer Server Components and dynamic imports for expensive client-only features.
- Keep Prisma query selections narrow.
- Avoid N+1 query patterns.
- Avoid unbounded rendering of long lists. Paginate or cap results.
- Use stable memoization only where it prevents real work; do not add `useMemo` and `useCallback` everywhere by default.
- Keep images sized and optimized where possible.
- Be careful with middleware and global providers because they affect many routes.

## Testing And QA

- Run `npm run lint` for TypeScript/React changes.
- Run `npm run build` for high-risk changes involving routing, auth, Prisma, Next config, metadata, or server/client boundaries.
- If adding a test framework, prefer a conventional stack for this project: Vitest or Jest for units, React Testing Library for component behavior, and Playwright for end-to-end flows.
- Add tests near the changed behavior when a suitable framework exists.
- For admin mutations, manually or programmatically verify auth behavior, validation failures, success writes, and revalidation impact.
- For Prisma schema changes, verify generated client types and migration behavior.
- For UI changes, check mobile and desktop layouts.
- Document any check that cannot run because of missing environment variables, database access, or absent test harness.

## Code Review Checklist

- Does the change preserve server/client boundaries?
- Are all untrusted inputs validated and normalized?
- Are admin routes protected at the API layer?
- Are Prisma queries bounded and appropriately selected?
- Are affected pages revalidated after mutations?
- Are database changes represented in Prisma schema and migrations as needed?
- Are public pages protected from drafts and archived posts?
- Does the UI remain accessible by keyboard and screen readers?
- Does the change keep bundle size reasonable?
- Are environment variables documented without exposing values?
- Were relevant checks run?

## Git And Change Management

- Check `git status --short` before editing.
- Do not revert user changes unless explicitly asked.
- Keep commits focused if the user asks for commits.
- Do not stage unrelated untracked files.
- Do not rewrite history, force push, or reset branches without explicit user approval.
- Prefer small, reviewable patches over sweeping refactors.
- If a refactor is required, separate mechanical movement from behavior changes where possible.

## Documentation Standards

- Update docs when commands, setup, environment variables, or behavior change.
- Keep examples runnable on Windows unless the docs are explicitly platform-specific.
- Prefer concise but complete explanations that a future agent or engineer can act on.
- Keep AGENTS.md current when workflow, tooling, or architectural conventions change.

## External Documentation And Web Use

- Use current official documentation when behavior may have changed, especially for Next.js, React, Prisma, PostgreSQL, NextAuth, Supabase, deployment providers, security advisories, and package-specific APIs.
- Prefer primary sources: official docs, release notes, RFCs, and package repositories.
- When relying on web research for a code change, summarize the source and apply it narrowly.
- Do not paste large copyrighted excerpts into the repo.

## High-Risk Areas In This Repo

- Auth/session behavior and admin allowlisting.
- Post publishing state and public visibility.
- Slug generation and URL stability.
- Prisma relation writes for posts, tags, categories, and authors.
- Database connection pressure in serverless or pooler environments.
- File uploads and remote images.
- Rich text and markdown rendering.
- Cache revalidation after mutations.
- Environment variable handling.

## Default Engineering Posture

- Act like a senior engineer maintaining a production app.
- Prefer correctness, security, and maintainability over cleverness.
- Follow existing code before inventing new patterns.
- Keep changes scoped to the user request.
- Ask only when missing information creates material risk; otherwise make a conservative, reversible choice.
- Leave the workspace cleaner than you found it, but do not perform unrelated cleanup.
