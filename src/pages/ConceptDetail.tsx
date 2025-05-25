
import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import StartAnalysisDialog from '@/components/analysis/StartAnalysisDialog'
import DevelopmentPanel from '@/components/development/DevelopmentPanel'
import { ArrowLeft, Play, Eye, Zap, Brain, FileText } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export default function ConceptDetail() {
  const { id } = useParams<{ id: string }>()
  const [showAnalysisDialog, setShowAnalysisDialog] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  
  const { data: concept, isLoading } = useQuery({
    queryKey: ['concept', id],
    queryFn: async () => {
      if (!id) throw new Error('Concept ID is required')
      
      const { data, error } = await supabase
        .from('concepts')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data
    },
    enabled: !!id,
  })
  
  const { data: analyses } = useQuery({
    queryKey: ['concept-analyses', id],
    queryFn: async () => {
      if (!id) return []
      
      const { data, error } = await supabase
        .from('analysis_jobs')
        .select('*')
        .eq('concept_id', id)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    },
    enabled: !!id,
  })

  const { data: developmentSession } = useQuery({
    queryKey: ['development-session', id],
    queryFn: async () => {
      if (!id) return null
      
      const { data, error } = await supabase
        .from('concept_development_sessions')
        .select('*')
        .eq('concept_id', id)
        .eq('is_active', true)
        .maybeSingle()
      
      if (error) throw error
      return data
    },
    enabled: !!id,
  })
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }
  
  if (!concept) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Concept not found</p>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/concepts/list">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Concepts
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{concept.name}</h1>
            <p className="text-muted-foreground">
              Created {formatDistanceToNow(new Date(concept.created_at))} ago
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setShowAnalysisDialog(true)}
            variant="outline"
          >
            <Brain className="h-4 w-4 mr-2" />
            EARL Analysis
          </Button>
          <Button
            onClick={() => setActiveTab('development')}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
          >
            <Zap className="h-4 w-4 mr-2" />
            AI Development
            {developmentSession && (
              <span className="ml-2 flex h-2 w-2 rounded-full bg-green-400" />
            )}
          </Button>
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">
            <FileText className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="analysis">
            <Brain className="h-4 w-4 mr-2" />
            EARL Analysis
          </TabsTrigger>
          <TabsTrigger value="development">
            <Zap className="h-4 w-4 mr-2" />
            AI Development
            {developmentSession && (
              <span className="ml-2 flex h-2 w-2 rounded-full bg-green-500" />
            )}
          </TabsTrigger>
          <TabsTrigger value="export">
            <FileText className="h-4 w-4 mr-2" />
            Export
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{concept.description}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium">Status</h4>
                  <Badge variant={
                    concept.status === 'completed' ? 'default' :
                    concept.status === 'draft' ? 'secondary' :
                    'outline'
                  }>
                    {concept.status}
                  </Badge>
                </div>
                
                {concept.domains && concept.domains.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Domains</h4>
                    <div className="flex flex-wrap gap-1">
                      {concept.domains.map((domain) => (
                        <Badge key={domain} variant="secondary" className="text-xs">
                          {domain}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analysis" className="space-y-4">
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
                        <Link to={`/concepts/${id}/analysis/${analysis.id}`}>
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
        </TabsContent>
        
        <TabsContent value="development" className="space-y-4">
          <DevelopmentPanel
            conceptId={concept.id}
            conceptName={concept.name}
          />
        </TabsContent>
        
        <TabsContent value="export" className="space-y-4">
          <ExportPanel concept={concept} />
        </TabsContent>
      </Tabs>
      
      {concept && (
        <StartAnalysisDialog
          conceptId={concept.id}
          conceptName={concept.name}
          open={showAnalysisDialog}
          onOpenChange={setShowAnalysisDialog}
        />
      )}
    </div>
  )
}
