import { getCurrentSession } from '@/lib/utils/auth'
import { redirect } from 'next/navigation'
import { TagsTable } from '@/components/admin/tags-table'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

async function getTags() {
  const tags = await prisma.tag.findMany({
    include: {
      _count: {
        select: {
          posts: {
            where: {
              post: {
                status: 'PUBLISHED'
              }
            }
          }
        }
      }
    },
    orderBy: {
      name: 'asc'
    }
  })
  
  return tags
}

export default async function TagsPage() {
  const session = await getCurrentSession()
  
  if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
    redirect('/admin/login')
  }
  
  const tags = await getTags()
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tags</h1>
          <p className="text-muted-foreground mt-2">
            Manage your blog tags and organize your content with keywords
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/tags/new">
            <Plus className="h-4 w-4 mr-2" />
            New Tag
          </Link>
        </Button>
      </div>
      
      <TagsTable tags={tags} />
    </div>
  )
}
