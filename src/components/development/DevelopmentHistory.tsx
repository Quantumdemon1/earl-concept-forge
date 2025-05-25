
import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { formatDistanceToNow } from 'date-fns'

interface DevelopmentHistoryProps {
  session: any
}

export default function DevelopmentHistory({ session }: DevelopmentHistoryProps) {
  const historyItems = useMemo(() => {
    if (!session?.history) return []
    
    return session.history.map((item: any, index: number) => ({
      iteration: index + 1,
      stage: item.stage || 'unknown',
      timestamp: item.timestamp || new Date().toISOString(),
      scores: item.scores || {},
      summary: item.summary || 'Iteration completed',
      findings: item.findings || [],
      actions: item.actions || [],
    }))
  }, [session?.history])
  
  if (!session) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Development History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No development history available.
          </div>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Development History</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          <div className="space-y-4">
            {historyItems.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No iterations completed yet.
              </div>
            ) : (
              historyItems.map((item) => (
                <div
                  key={item.iteration}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        Iteration {item.iteration}
                      </Badge>
                      <Badge variant="secondary">
                        {item.stage}
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                  
                  <p className="text-sm">{item.summary}</p>
                  
                  {/* Quality Scores */}
                  {Object.keys(item.scores).length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {Object.entries(item.scores).map(([key, value]) => (
                        <div key={key} className="text-center">
                          <div className="text-lg font-semibold">
                            {Math.round((value as number) * 100)}%
                          </div>
                          <div className="text-xs text-muted-foreground capitalize">
                            {key}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Key Findings */}
                  {item.findings.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium mb-2">Key Findings:</h5>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {item.findings.map((finding: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-primary">•</span>
                            <span>{finding}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Actions Taken */}
                  {item.actions.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium mb-2">Actions Taken:</h5>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {item.actions.map((action: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-green-500">✓</span>
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
