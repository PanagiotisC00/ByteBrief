// Test page to compare client vs server sessions
'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Session } from 'next-auth'

export default function TestSessionPage() {
  const { data: clientSession, status } = useSession()
  const [serverSession, setServerSession] = useState<Session | null>(null)

  useEffect(() => {
    // Fetch server session via API
    fetch('/api/test-session')
      .then(res => res.json())
      .then(data => setServerSession(data))
      .catch(err => console.error('Error fetching server session:', err))
  }, [])

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-2xl font-bold mb-8">Session Debug Test</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Client Session */}
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">Client Session (useSession)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div><strong>Status:</strong> {status}</div>
                <div><strong>Session exists:</strong> {clientSession ? 'Yes' : 'No'}</div>
                {clientSession?.user && (
                  <>
                    <div><strong>Email:</strong> {clientSession.user.email}</div>
                    <div><strong>Name:</strong> {clientSession.user.name}</div>
                    <div><strong>Role:</strong> {clientSession.user.role || 'undefined'}</div>
                    <div><strong>ID:</strong> {clientSession.user.id || 'undefined'}</div>
                  </>
                )}
                <details className="mt-4">
                  <summary className="cursor-pointer font-semibold">Full Client Session</summary>
                  <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto">
                    {JSON.stringify(clientSession, null, 2)}
                  </pre>
                </details>
              </div>
            </CardContent>
          </Card>

          {/* Server Session */}
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-600">Server Session (getServerSession)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div><strong>Session exists:</strong> {serverSession ? 'Yes' : 'No'}</div>
                {serverSession?.user && (
                  <>
                    <div><strong>Email:</strong> {serverSession.user.email}</div>
                    <div><strong>Name:</strong> {serverSession.user.name}</div>
                    <div><strong>Role:</strong> {serverSession.user.role || 'undefined'}</div>
                    <div><strong>ID:</strong> {serverSession.user.id || 'undefined'}</div>
                  </>
                )}
                <details className="mt-4">
                  <summary className="cursor-pointer font-semibold">Full Server Session</summary>
                  <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto">
                    {JSON.stringify(serverSession, null, 2)}
                  </pre>
                </details>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-orange-600">Diagnosis</CardTitle>
            </CardHeader>
            <CardContent>
              {status === 'loading' ? (
                <p>Loading sessions...</p>
              ) : (
                <div className="space-y-2">
                  <div>
                    <strong>Client authenticated:</strong> {status === 'authenticated' ? '✅ Yes' : '❌ No'}
                  </div>
                  <div>
                    <strong>Server authenticated:</strong> {serverSession ? '✅ Yes' : '❌ No'}
                  </div>
                  <div>
                    <strong>Client has role:</strong> {clientSession?.user?.role ? `✅ ${clientSession.user.role}` : '❌ No'}
                  </div>
                  <div>
                    <strong>Server has role:</strong> {serverSession?.user?.role ? `✅ ${serverSession.user.role}` : '❌ No'}
                  </div>
                  {clientSession && !serverSession && (
                    <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded">
                      <strong>⚠️ Issue Found:</strong> Client has session but server doesn't! This is a session sync problem.
                    </div>
                  )}
                  {clientSession?.user?.role && !serverSession?.user?.role && (
                    <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded">
                      <strong>⚠️ Issue Found:</strong> Client has role but server doesn't! This is a JWT token problem.
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
