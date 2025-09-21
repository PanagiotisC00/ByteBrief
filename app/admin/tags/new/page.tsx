import { getCurrentSession } from '@/lib/utils/auth'
import { redirect } from 'next/navigation'
import { NewTagForm } from '@/components/admin/new-tag-form'

export default async function NewTagPage() {
  const session = await getCurrentSession()
  
  if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
    redirect('/admin/login')
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">New Tag</h1>
          <p className="text-muted-foreground mt-2">
            Create a new tag to help organize and categorize your blog posts
          </p>
        </div>
        
        <NewTagForm />
      </div>
    </div>
  )
}
