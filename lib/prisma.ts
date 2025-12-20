// Prisma client singleton for ByteBrief blog
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Adjust the DSN to be pooler-friendly if pgbouncer=true and no connection_limit/pool_timeout set.
function buildDbUrl() {
  const raw = process.env.DATABASE_URL
  if (!raw) return raw
  try {
    const u = new URL(raw)
    const isPooler = u.hostname.includes('pooler')
    const hasPgBouncer = u.searchParams.get('pgbouncer') === 'true'
    const hasConnLimit = u.searchParams.has('connection_limit')
    const hasPoolTimeout = u.searchParams.has('pool_timeout')

    if (isPooler || hasPgBouncer) {
      if (!hasConnLimit) u.searchParams.set('connection_limit', '5')
      if (!hasPoolTimeout) u.searchParams.set('pool_timeout', '5')
    }
    return u.toString()
  } catch {
    return raw
  }
}

const existingPrisma = globalForPrisma.prisma
const adjustedUrl = buildDbUrl()

export const prisma =
  existingPrisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    datasources: adjustedUrl
      ? {
          db: { url: adjustedUrl }
        }
      : undefined
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
