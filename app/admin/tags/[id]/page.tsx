import { getCurrentSession } from '@/lib/utils/auth'
import { redirect, notFound } from 'next/navigation'
import { EditTagForm } from '@/components/admin/edit-tag-form'
import { prisma } from '@/lib/prisma'

interface EditTagPageProps {
  params: { id: string }
}

async function getTag(id: string) {
  const tag = await prisma.tag.findUnique({
    where: { id },
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
    }
  })
  
  return tag
}

export default async function EditTagPage({ params }: EditTagPageProps) {
  const session = await getCurrentSession()
  
  if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
    redirect('/admin/login')
  }
  
  const tag = await getTag(params.id)
  
  if (!tag) {
    notFound()
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Edit Tag</h1>
          <p className="text-muted-foreground mt-2">
            Update "{tag.name}" tag details
          </p>
        </div>
        
        <EditTagForm tag={tag} />
      </div>
    </div>
  )
}
