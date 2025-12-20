// Admin dashboard homepage
import { getCurrentSession } from '@/lib/utils/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PlusCircle, FileText, FolderOpen, Tag } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'

async function getAdminStats() {
  // Clearance: avoid parallel Prisma queries on serverless to reduce connection pool contention
  const totalPosts = await prisma.post.count()
  const draftPosts = await prisma.post.count({ where: { status: 'DRAFT' } })
  const publishedPosts = await prisma.post.count({ where: { status: 'PUBLISHED' } })
  const totalCategories = await prisma.category.count()
  const totalTags = await prisma.tag.count()
  const recentPosts = await prisma.post.findMany({
    take: 5,
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      title: true,
      status: true,
      updatedAt: true,
    }
  })

  return {
    totalPosts,
    draftPosts,
    publishedPosts,
    totalCategories,
    totalTags,
    recentPosts
  }
}

export default async function AdminDashboard() {
  // Check authentication
  const session = await getCurrentSession()

  if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
    redirect('/admin/login')
  }

  const stats = await getAdminStats()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">Manage your ByteBrief blog content</p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90">
          <Link href="/admin/posts/new">
            <PlusCircle className="h-4 w-4 mr-2" />
            New Post
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPosts}</div>
            <p className="text-xs text-muted-foreground">
              {stats.publishedPosts} published, {stats.draftPosts} drafts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCategories}</div>
            <p className="text-xs text-muted-foreground">Content categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tags</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTags}</div>
            <p className="text-xs text-muted-foreground">Content tags</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Content Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild variant="outline" className="w-full justify-start hover:text-accent hover:border-accent transition-colors">
              <Link href="/admin/posts">
                <FileText className="h-4 w-4 mr-2" />
                Manage Posts
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start hover:text-accent hover:border-accent transition-colors">
              <Link href="/admin/categories">
                <FolderOpen className="h-4 w-4 mr-2" />
                Manage Categories
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start hover:text-accent hover:border-accent transition-colors">
              <Link href="/admin/tags">
                <Tag className="h-4 w-4 mr-2" />
                Manage Tags
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentPosts.length > 0 ? (
              <div className="space-y-3">
                {stats.recentPosts.map((post) => (
                  <div key={post.id} className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/admin/posts/${post.id}`}
                        className="text-sm font-medium text-foreground hover:text-accent truncate block"
                      >
                        {post.title}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(post.updatedAt), { addSuffix: true })}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${post.status === 'PUBLISHED'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                      }`}>
                      {post.status.toLowerCase()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Recent posts and updates will appear here once you start creating content.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Database</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Connected</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Authentication</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
