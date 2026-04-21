import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getCurrentSession } from '@/lib/utils/auth'
import { prisma } from '@/lib/prisma'
import { formatZodError, tagBodySchema } from '@/lib/validation/admin'

export async function POST(request: NextRequest) {
  try {
    const session = await getCurrentSession()
    
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const parsedBody = tagBodySchema.safeParse(body)
    if (!parsedBody.success) {
      return NextResponse.json(formatZodError(parsedBody.error), { status: 400 })
    }

    const { name, slug } = parsedBody.data

    const existingTag = await prisma.tag.findFirst({
      where: {
        OR: [
          { name },
          { slug },
        ],
      },
    })

    if (existingTag) {
      return NextResponse.json(
        { error: existingTag.slug === slug ? 'A tag with this slug already exists' : 'A tag with this name already exists' },
        { status: 400 }
      )
    }

    // Create the tag
    const tag = await prisma.tag.create({
      data: {
        name,
        slug
      }
    })

    // Revalidate relevant pages
    revalidatePath('/admin/tags')
    revalidatePath('/admin')
    revalidatePath('/')
    revalidatePath('/blog')
    revalidatePath('/news')
    revalidatePath(`/tag/${tag.slug}`)

    return NextResponse.json(tag, { status: 201 })
  } catch (error) {
    console.error('Error creating tag:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
