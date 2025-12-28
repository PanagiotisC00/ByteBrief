import { getCurrentSession } from '@/lib/utils/auth'
import { redirect, notFound } from 'next/navigation'
import { EditCategoryForm } from '@/components/admin/edit-category-form'
import { prisma } from '@/lib/prisma'

interface EditCategoryPageProps {
  params: { id: string }
}

async function getCategory(id: string) {
  const category = await prisma.category.findUnique({
    where: { id },
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
    }
  })
  
  return category
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const session = await getCurrentSession()
  
  if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
    redirect('/admin/login')
  }
  
  const category = await getCategory(params.id)
  
  if (!category) {
    notFound()
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Edit Category</h1>
          <p className="text-muted-foreground mt-2">
            Update &quot;{category.name}&quot; category details
          </p>
        </div>
        
        <EditCategoryForm category={category} />
      </div>
    </div>
  )
}
