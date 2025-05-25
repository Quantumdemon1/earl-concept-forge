
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import AnalysisMonitor from '@/components/analysis/AnalysisMonitor'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

export default function AnalysisView() {
  const { id: conceptId, stage: jobId } = useParams<{ id: string; stage: string }>()
  
  const { data: concept } = useQuery({
    queryKey: ['concept', conceptId],
    queryFn: async () => {
      if (!conceptId) throw new Error('Concept ID is required')
      
      const { data, error } = await supabase
        .from('concepts')
        .select('*')
        .eq('id', conceptId)
        .single()
      
      if (error) throw error
      return data
    },
    enabled: !!conceptId,
  })
  
  if (!jobId) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to={`/concepts/${conceptId}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Concept
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Analysis</h1>
        </div>
        
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">No analysis job specified</p>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link to={`/concepts/${conceptId}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Concept
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Analysis</h1>
          {concept && (
            <p className="text-muted-foreground">
              EARL framework analysis for "{concept.name}"
            </p>
          )}
        </div>
      </div>
      
      <AnalysisMonitor jobId={jobId} />
    </div>
  )
}
