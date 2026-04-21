// API route for handling image uploads to Supabase Storage
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentSession } from '@/lib/utils/auth'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { v4 as uuidv4 } from 'uuid'
import {
  describeUploadImage,
  getAllowedUploadImageMimeTypes,
  getMaxUploadImageBytes,
} from '@/lib/security/images'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getCurrentSession()
    
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const allowedMimeTypes = getAllowedUploadImageMimeTypes()
    if (!allowedMimeTypes.includes(file.type as (typeof allowedMimeTypes)[number])) {
      return NextResponse.json(
        { error: 'File must be a JPG, PNG, WebP, or GIF image' },
        { status: 400 }
      )
    }

    // Validate file size (5MB limit)
    if (file.size > getMaxUploadImageBytes()) {
      return NextResponse.json({ error: 'File must be less than 5MB' }, { status: 400 })
    }

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)
    const descriptor = describeUploadImage(file.type, uint8Array)

    if (!descriptor) {
      return NextResponse.json(
        { error: 'File contents do not match an allowed image type' },
        { status: 400 }
      )
    }

    const fileName = `${Date.now()}-${uuidv4()}.${descriptor.extension}`
    const filePath = fileName

    // Upload to Supabase Storage with service role for admin operations
    const supabase = createServiceRoleClient()
    
    const { error } = await supabase.storage
      .from('blog-images')
      .upload(filePath, uint8Array, {
        contentType: descriptor.mimeType,
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Supabase upload error:', error)
      return NextResponse.json(
        { error: 'Failed to upload to storage' },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('blog-images')
      .getPublicUrl(filePath)

    if (!urlData.publicUrl) {
      return NextResponse.json(
        { error: 'Failed to get public URL' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      url: urlData.publicUrl,
      path: filePath,
      filename: fileName
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
