// API route to test server session
import { NextResponse } from 'next/server'
import { getCurrentSession } from '@/lib/utils/auth'

export async function GET() {
  try {
    console.log('=== SERVER SESSION TEST ===')
    const session = await getCurrentSession()
    console.log('Server session:', session)
    console.log('User:', session?.user)
    console.log('Role:', session?.user?.role)
    console.log('========================')
    
    return NextResponse.json(session)
  } catch (error) {
    console.error('Error getting server session:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
