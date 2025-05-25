
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Eye } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface ConceptAnalysisTabProps {
  conceptId: string
  analyses?: Array<{
    id: string
    status: string
    progress: number
    current_stage: string
    created_at: string
  }>
}

export default function ConceptAnalysisTab({ conceptId, analyses }: ConceptAnalysisTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analysis History</CardTitle>
      </CardHeader>
      <CardContent>
        {analyses && analyses.length > 0 ? (
          <div className="space-y-3">
            {analyses.map((analysis) => (
              <div
                key={analysis.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      analysis.status === 'completed' ? 'default' :
                      analysis.status === 'failed' ? 'destructive' :
                      'secondary'
                    }>
                      {analysis.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(analysis.created_at))} ago
                    </span>
                  </div>
                  <p className="text-sm">
                    Progress: {analysis.progress || 0}% • Current stage: {analysis.current_stage || 'pending'}
                  </p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/concepts/${conceptId}/analysis/${analysis.id}`}>
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            No analyses yet. Start your first analysis to begin.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
