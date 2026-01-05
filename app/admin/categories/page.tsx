import { getCurrentSession } from '@/lib/utils/auth'
import { redirect } from 'next/navigation'
import { CategoriesTable } from '@/components/admin/categories-table'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

async function getCategories() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: {
          posts: {
            where: {
              status: 'PUBLISHED'
            }
          }
        }
      }
    },
    orderBy: {
      name: 'asc'
    }
  })
  
  return categories
}

export default async function CategoriesPage() {
  const session = await getCurrentSession()
  
  if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
    redirect('/admin/login')
  }
  
  const categories = await getCategories()
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Categories</h1>
          <p className="text-muted-foreground mt-2">
            Manage your blog categories and organize your content
          </p>
        </div>
        <Button asChild className="bg-primary text-primary-foreground hover:bg-[#7fffc1] hover:text-[#0f1f16]">
          <Link href="/admin/categories/new">
            <Plus className="h-4 w-4 mr-2" />
            New Category
          </Link>
        </Button>
      </div>
      
      <CategoriesTable categories={categories} />
    </div>
  )
}
