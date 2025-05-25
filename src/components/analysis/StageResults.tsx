
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import ConceptNetworkGraph from '@/components/visualizations/ConceptNetworkGraph'
import UncertaintyHeatmap from '@/components/visualizations/UncertaintyHeatmap'
import MetricsDisplay from '@/components/analysis/MetricsDisplay'
import { FileText, Network, BarChart3, Brain } from 'lucide-react'

interface StageResultsProps {
  conceptId: string
  stage: 'evaluate' | 'analyze' | 'refine' | 'reiterate'
}

export default function StageResults({ conceptId, stage }: StageResultsProps) {
  const { data: analysis, isLoading } = useQuery({
    queryKey: ['analysis', conceptId, stage],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('concept_analyses')
        .select('*')
        .eq('concept_id', conceptId)
        .eq('stage', stage)
        .order('version', { ascending: false })
        .limit(1)
        .maybeSingle()
      
      if (error) throw error
      return data
    },
  })
  
  const { data: visualizations } = useQuery({
    queryKey: ['visualizations', conceptId, stage],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('visualizations')
        .select('*')
        .eq('concept_id', conceptId)
        .eq('stage', stage)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    },
    enabled: !!analysis,
  })
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-64" />
        <Skeleton className="h-96" />
      </div>
    )
  }
  
  if (!analysis) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground">No results available for this stage</p>
        </CardContent>
      </Card>
    )
  }
  
  const stageOutput = analysis[`${stage}_output`] || {}
  
  return (
    <div className="space-y-6">
      {/* Stage Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {stage === 'evaluate' && <FileText className="h-5 w-5" />}
              {stage === 'analyze' && <Network className="h-5 w-5" />}
              {stage === 'refine' && <BarChart3 className="h-5 w-5" />}
              {stage === 'reiterate' && <Brain className="h-5 w-5" />}
              {stage.charAt(0).toUpperCase() + stage.slice(1)} Results
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge>Version {analysis.version}</Badge>
              {analysis.ai_assisted && <Badge variant="secondary">AI</Badge>}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Processing Time
              </p>
              <p className="text-2xl font-bold">
                {analysis.processing_time?.toFixed(2)}s
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Overall Confidence
              </p>
              <p className="text-2xl font-bold">
                {((analysis.confidence_scores?.overall || 0) * 100).toFixed(0)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Stage-specific content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="visualizations">Visualizations</TabsTrigger>
          <TabsTrigger value="raw">Raw Data</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          {stage === 'evaluate' && (
            <EvaluateOverview data={stageOutput} />
          )}
          {stage === 'analyze' && (
            <AnalyzeOverview data={stageOutput} />
          )}
          {stage === 'refine' && (
            <RefineOverview data={stageOutput} />
          )}
          {stage === 'reiterate' && (
            <ReiterateOverview data={stageOutput} />
          )}
        </TabsContent>
        
        <TabsContent value="details" className="space-y-4">
          <MetricsDisplay
            metrics={stageOutput.metrics || {}}
            uncertainties={analysis.uncertainty_assessment || {}}
          />
        </TabsContent>
        
        <TabsContent value="visualizations" className="space-y-4">
          {visualizations && visualizations.length > 0 ? (
            visualizations.map((viz) => (
              <div key={viz.id}>
                {viz.type === 'network_graph' && (
                  <ConceptNetworkGraph data={viz.data} />
                )}
                {viz.type === 'heatmap' && (
                  <UncertaintyHeatmap data={viz.data} />
                )}
              </div>
            ))
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <p className="text-muted-foreground">No visualizations available</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="raw">
          <Card>
            <CardContent className="p-4">
              <pre className="overflow-auto rounded-lg bg-muted p-4 text-sm">
                {JSON.stringify(stageOutput, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Stage-specific overview components
function EvaluateOverview({ data }: { data: any }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Concept Domains</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {data.formal_mapping?.concept_domains?.map((domain: string, index: number) => (
              <Badge key={`${domain}-${index}`} variant="secondary">
                {domain}
              </Badge>
            )) || (
              <span className="text-sm text-muted-foreground">No domains identified</span>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Core Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {data.metric_assessment?.core_metrics?.slice(0, 3).map((metric: any, index: number) => (
              <div key={`${metric.name}-${index}`} className="flex justify-between">
                <span className="text-sm">{metric.name}</span>
                <Badge variant="outline">
                  {metric.confidence?.toFixed(2) || 'N/A'}
                </Badge>
              </div>
            )) || (
              <span className="text-sm text-muted-foreground">No metrics available</span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function AnalyzeOverview({ data }: { data: any }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Network Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Total Nodes</span>
              <Badge variant="outline">
                {data.network?.nodes?.length || 0}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Total Links</span>
              <Badge variant="outline">
                {data.network?.links?.length || 0}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Density</span>
              <Badge variant="outline">
                {data.network?.density?.toFixed(3) || 'N/A'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Key Relationships</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {data.relationships?.slice(0, 3).map((rel: any, index: number) => (
              <div key={index} className="text-sm">
                <span className="font-medium">{rel.source}</span>
                <span className="text-muted-foreground"> → </span>
                <span className="font-medium">{rel.target}</span>
                <Badge variant="outline" className="ml-2">
                  {rel.strength?.toFixed(2) || 'N/A'}
                </Badge>
              </div>
            )) || (
              <span className="text-sm text-muted-foreground">No relationships found</span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function RefineOverview({ data }: { data: any }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Refinements Applied</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {data.refinements?.map((refinement: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm">{refinement.type}</span>
                <Badge variant={refinement.impact === 'high' ? 'default' : 'secondary'}>
                  {refinement.impact}
                </Badge>
              </div>
            )) || (
              <span className="text-sm text-muted-foreground">No refinements applied</span>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quality Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Completeness</span>
              <Badge variant="outline">
                {((data.quality?.completeness || 0) * 100).toFixed(0)}%
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Consistency</span>
              <Badge variant="outline">
                {((data.quality?.consistency || 0) * 100).toFixed(0)}%
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Accuracy</span>
              <Badge variant="outline">
                {((data.quality?.accuracy || 0) * 100).toFixed(0)}%
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ReiterateOverview({ data }: { data: any }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Iteration Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Cycles Completed</span>
              <Badge variant="outline">
                {data.cycles_completed || 0}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Convergence Score</span>
              <Badge variant="outline">
                {((data.convergence_score || 0) * 100).toFixed(0)}%
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Stability</span>
              <Badge variant="outline">
                {data.stability || 'N/A'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Final Adjustments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {data.final_adjustments?.slice(0, 3).map((adjustment: any, index: number) => (
              <div key={index} className="text-sm">
                <span className="font-medium">{adjustment.component}</span>
                <div className="text-muted-foreground">
                  {adjustment.description}
                </div>
              </div>
            )) || (
              <span className="text-sm text-muted-foreground">No adjustments made</span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
