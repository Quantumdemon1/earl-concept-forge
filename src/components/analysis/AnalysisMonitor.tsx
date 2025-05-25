
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import StageProgress from '@/components/earl/StageProgress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Activity, AlertCircle, CheckCircle2 } from 'lucide-react'

interface AnalysisMonitorProps {
  jobId: string
}

type StageStatus = 'pending' | 'running' | 'completed' | 'error'

interface Stage {
  name: string
  status: StageStatus
  confidence?: number
}

interface AnalysisConfig {
  enableAI?: boolean
  skipStages?: string[]
}

export default function AnalysisMonitor({ jobId }: AnalysisMonitorProps) {
  const [stages, setStages] = useState<Stage[]>([
    { name: 'evaluate', status: 'pending', confidence: undefined },
    { name: 'analyze', status: 'pending', confidence: undefined },
    { name: 'refine', status: 'pending', confidence: undefined },
    { name: 'reiterate', status: 'pending', confidence: undefined },
  ])
  
  const { data: job, isLoading } = useQuery({
    queryKey: ['analysis-job', jobId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('analysis_jobs')
        .select('*')
        .eq('id', jobId)
        .single()
      
      if (error) throw error
      return data
    },
    refetchInterval: 2000, // Poll every 2 seconds
  })
  
  useEffect(() => {
    if (!job) return
    
    const updatedStages = stages.map((stage) => {
      if (job.stages_completed?.includes(stage.name)) {
        return { ...stage, status: 'completed' as StageStatus }
      } else if (job.current_stage === stage.name) {
        return { ...stage, status: 'running' as StageStatus }
      }
      return stage
    })
    setStages(updatedStages)
  }, [job])
  
  if (isLoading || !job) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </CardContent>
      </Card>
    )
  }
  
  // Type guard for config
  const getConfig = (): AnalysisConfig => {
    if (typeof job.config === 'object' && job.config !== null) {
      return job.config as AnalysisConfig
    }
    return {}
  }
  
  const config = getConfig()
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Analysis Progress
            </CardTitle>
            <Badge variant={
              job.status === 'completed' ? 'default' :
              job.status === 'failed' ? 'destructive' :
              'secondary'
            }>
              {job.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <StageProgress stages={stages} currentStage={job.current_stage} />
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Overall Progress</span>
              <span className="font-medium">{job.progress || 0}%</span>
            </div>
            <Progress value={job.progress || 0} />
          </div>
          
          {job.status === 'failed' && job.errors && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Analysis failed. Please try again.
              </AlertDescription>
            </Alert>
          )}
          
          {job.status === 'completed' && (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                Analysis completed successfully!
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Analysis Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">AI Assistance:</span>
              <span>{config.enableAI ? 'Enabled' : 'Disabled'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Stages:</span>
              <span>{4 - (config.skipStages?.length || 0)} of 4</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
