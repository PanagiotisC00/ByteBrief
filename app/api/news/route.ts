import { NextRequest, NextResponse } from 'next/server'
import { getNewsPosts } from '@/lib/blog'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || undefined
    const search = searchParams.get('search') || undefined
    
    const posts = await getNewsPosts(
      category === 'all' ? undefined : category,
      search
    )
    
    return NextResponse.json(posts)
  } catch (error) {
    console.error('Failed to fetch news posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}
