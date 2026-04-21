import { PostStatus } from '@prisma/client'
import { z } from 'zod'

import { isAllowedAdminImageUrl } from '@/lib/security/images'

const CATEGORY_ICON_MAX_LENGTH = 100
const EXCERPT_MAX_LENGTH = 500
const IMAGE_ALT_MAX_LENGTH = 180
const POST_CONTENT_MAX_LENGTH = 200_000
const POST_TITLE_MAX_LENGTH = 200
const DESCRIPTION_MAX_LENGTH = 500
const NAME_MAX_LENGTH = 80
const TAGS_MAX_COUNT = 20
const SOURCES_MAX_COUNT = 10

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const hexColorPattern = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/

const safeWebUrlSchema = z
  .string()
  .url('Must be a valid URL')
  .refine((value) => {
    try {
      const url = new URL(value)
      return url.protocol === 'https:'
    } catch {
      return false
    }
  }, 'URL must use HTTPS')

function normalizeOptionalString(value: unknown) {
  if (typeof value !== 'string') {
    return value
  }

  const trimmed = value.trim()
  return trimmed === '' ? undefined : trimmed
}

const cuidSchema = z.string().cuid('Invalid id')

const requiredText = (label: string, maxLength: number) =>
  z
    .string({ required_error: `${label} is required` })
    .trim()
    .min(1, `${label} is required`)
    .max(maxLength, `${label} must be ${maxLength} characters or fewer`)

const optionalText = (label: string, maxLength: number) =>
  z.preprocess(
    normalizeOptionalString,
    z.string().max(maxLength, `${label} must be ${maxLength} characters or fewer`).optional()
  )

const optionalSlugText = z.preprocess(
  normalizeOptionalString,
  z
    .string()
    .regex(slugPattern, 'Slug must contain only lowercase letters, numbers, and hyphens')
    .optional()
)

const optionalColor = z.preprocess(
  normalizeOptionalString,
  z.string().regex(hexColorPattern, 'Color must be a valid hex value').optional()
)

const optionalSources = z
  .preprocess((value) => {
    if (typeof value !== 'string') {
      return value
    }

    const normalized = value
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean)

    return normalized.length > 0 ? normalized : undefined
  }, z.array(safeWebUrlSchema).max(SOURCES_MAX_COUNT, `No more than ${SOURCES_MAX_COUNT} source URLs`).optional())
  .transform((sources) => (sources ? sources.join(', ') : undefined))

export const postBodySchema = z
  .object({
    title: requiredText('Title', POST_TITLE_MAX_LENGTH),
    excerpt: optionalText('Excerpt', EXCERPT_MAX_LENGTH),
    content: requiredText('Content', POST_CONTENT_MAX_LENGTH),
    image: z
      .preprocess(
        normalizeOptionalString,
        z
          .string()
          .refine(
            (value) => isAllowedAdminImageUrl(value, process.env.NEXT_PUBLIC_SUPABASE_URL),
            'Featured image must use HTTPS or a root-relative app path'
          )
          .optional()
      ),
    imageAlt: optionalText('Alt text', IMAGE_ALT_MAX_LENGTH),
    categoryId: cuidSchema,
    sources: optionalSources,
    status: z.nativeEnum(PostStatus).default(PostStatus.DRAFT),
    tags: z
      .array(cuidSchema)
      .max(TAGS_MAX_COUNT, `No more than ${TAGS_MAX_COUNT} tags are allowed`)
      .optional()
      .transform((tagIds) => [...new Set(tagIds ?? [])]),
  })
  .strict()

export const adminIdParamsSchema = z.object({
  id: cuidSchema,
})

export const categoryBodySchema = z
  .object({
    name: requiredText('Name', NAME_MAX_LENGTH),
    slug: requiredText('Slug', NAME_MAX_LENGTH).regex(
      slugPattern,
      'Slug must contain only lowercase letters, numbers, and hyphens'
    ),
    description: optionalText('Description', DESCRIPTION_MAX_LENGTH),
    color: optionalColor,
    icon: optionalText('Icon', CATEGORY_ICON_MAX_LENGTH),
  })
  .strict()

export const tagBodySchema = z
  .object({
    name: requiredText('Name', NAME_MAX_LENGTH),
    slug: requiredText('Slug', NAME_MAX_LENGTH).regex(
      slugPattern,
      'Slug must contain only lowercase letters, numbers, and hyphens'
    ),
  })
  .strict()

export const newsSortSchema = z.enum(['date-desc', 'date-asc', 'topic'])

export function formatZodError(error: z.ZodError) {
  const flattened = error.flatten()
  const firstIssue = error.issues[0]

  return {
    error: firstIssue?.message ?? 'Invalid request body',
    details: flattened.fieldErrors,
  }
}
