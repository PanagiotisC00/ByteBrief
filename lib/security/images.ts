const BLOG_IMAGE_BUCKET = 'blog-images'
const MAX_UPLOAD_IMAGE_BYTES = 5 * 1024 * 1024

const ALLOWED_UPLOAD_IMAGE_TYPES = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
} as const

type AllowedUploadImageMimeType = keyof typeof ALLOWED_UPLOAD_IMAGE_TYPES

type UploadImageDescriptor = {
  extension: (typeof ALLOWED_UPLOAD_IMAGE_TYPES)[AllowedUploadImageMimeType]
  mimeType: AllowedUploadImageMimeType
}

function hasPngSignature(bytes: Uint8Array) {
  return (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  )
}

function hasJpegSignature(bytes: Uint8Array) {
  return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
}

function hasGifSignature(bytes: Uint8Array) {
  return (
    bytes.length >= 6 &&
    bytes[0] === 0x47 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x38 &&
    (bytes[4] === 0x37 || bytes[4] === 0x39) &&
    bytes[5] === 0x61
  )
}

function hasWebpSignature(bytes: Uint8Array) {
  return (
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  )
}

export function getAllowedUploadImageMimeTypes() {
  return Object.keys(ALLOWED_UPLOAD_IMAGE_TYPES) as AllowedUploadImageMimeType[]
}

export function getAllowedUploadImageAcceptValue() {
  return getAllowedUploadImageMimeTypes().join(',')
}

export function getMaxUploadImageBytes() {
  return MAX_UPLOAD_IMAGE_BYTES
}

export function getPublicBlogImageBucketPath() {
  return `/storage/v1/object/public/${BLOG_IMAGE_BUCKET}/`
}

export function isAllowedAdminImageUrl(value: string, _supabaseUrl?: string) {
  const trimmed = value.trim()

  if (!trimmed) {
    return false
  }

  if (trimmed.startsWith('/')) {
    return !trimmed.startsWith('//')
  }

  try {
    const url = new URL(trimmed)
    return url.protocol === 'https:'
  } catch {
    return false
  }
}

export function describeUploadImage(
  mimeType: string,
  bytes: Uint8Array
): UploadImageDescriptor | null {
  const normalizedMimeType = mimeType.trim().toLowerCase()

  switch (normalizedMimeType) {
    case 'image/jpeg':
      return hasJpegSignature(bytes) ? { mimeType: 'image/jpeg', extension: 'jpg' } : null
    case 'image/png':
      return hasPngSignature(bytes) ? { mimeType: 'image/png', extension: 'png' } : null
    case 'image/webp':
      return hasWebpSignature(bytes) ? { mimeType: 'image/webp', extension: 'webp' } : null
    case 'image/gif':
      return hasGifSignature(bytes) ? { mimeType: 'image/gif', extension: 'gif' } : null
    default:
      return null
  }
}
