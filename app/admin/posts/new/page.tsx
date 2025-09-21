// Create new blog post page
import { getCurrentSession } from '@/lib/utils/auth'
import { prisma } from '@/lib/prisma'
import { NewPostForm } from '@/components/admin/new-post-form'
import { redirect } from 'next/navigation'

async function getCategories() {
  return await prisma.category.findMany({
    orderBy: { name: 'asc' }
  })
}

async function getTags() {
  return await prisma.tag.findMany({
    orderBy: { name: 'asc' }
  })
}

export default async function NewPostPage() {
  // Check authentication
  const session = await getCurrentSession()
  
  if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
    redirect('/admin/login')
  }

  const [categories, tags] = await Promise.all([
    getCategories(),
    getTags()
  ])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Create New Post</h1>
        <p className="text-muted-foreground mt-2">Write and publish a new blog post</p>
      </div>

      <NewPostForm 
        categories={categories} 
        tags={tags}
        authorId={session.user.id}
      />
    </div>
  )
}
