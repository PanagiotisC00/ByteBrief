// Admin posts management page
import { requireAdmin } from '@/lib/utils/auth'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { PostsTable } from '@/components/admin/posts-table'
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'

async function getPosts() {
  return await prisma.post.findMany({
    include: {
      author: {
        select: {
          name: true,
          email: true
        }
      },
      category: {
        select: {
          name: true,
          color: true
        }
      },
      _count: {
        select: {
          comments: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}

export default async function AdminPostsPage() {
  await requireAdmin()
  const posts = await getPosts()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Posts Management</h1>
          <p className="text-muted-foreground mt-2">Create, edit, and manage your blog posts</p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90">
          <Link href="/admin/posts/new">
            <PlusCircle className="h-4 w-4 mr-2" />
            New Post
          </Link>
        </Button>
      </div>

      <PostsTable posts={posts} />
    </div>
  )
}
