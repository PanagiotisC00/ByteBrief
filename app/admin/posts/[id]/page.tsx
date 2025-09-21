// Edit existing blog post page
import { getCurrentSession } from '@/lib/utils/auth'
import { prisma } from '@/lib/prisma'
import { EditPostForm } from '@/components/admin/edit-post-form'
import { redirect, notFound } from 'next/navigation'

async function getPost(id: string) {
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          name: true,
          email: true
        }
      },
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
          color: true
        }
      },
      tags: {
        include: {
          tag: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          }
        }
      }
    }
  })

  return post
}

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

export default async function EditPostPage({ params }: { params: { id: string } }) {
  // Check authentication
  const session = await getCurrentSession()
  
  if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
    redirect('/admin/login')
  }

  const [post, categories, tags] = await Promise.all([
    getPost(params.id),
    getCategories(),
    getTags()
  ])

  if (!post) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Edit Post</h1>
        <p className="text-muted-foreground mt-2">Update your blog post</p>
      </div>

      <EditPostForm 
        post={post}
        categories={categories} 
        tags={tags}
      />
    </div>
  )
}
