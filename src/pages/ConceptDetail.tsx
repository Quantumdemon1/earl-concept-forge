
import { useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import StartAnalysisDialog from '@/components/analysis/StartAnalysisDialog'
import DevelopmentPanel from '@/components/development/DevelopmentPanel'
import ExportPanel from '@/components/export/ExportPanel'
import ConceptHeader from '@/components/concept/ConceptHeader'
import ConceptOverviewTab from '@/components/concept/ConceptOverviewTab'
import ConceptAnalysisTab from '@/components/concept/ConceptAnalysisTab'
import { Zap, Brain, FileText } from 'lucide-react'

// UUID validation helper
const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

export default function ConceptDetail() {
  const { id } = useParams<{ id: string }>()
  const [showAnalysisDialog, setShowAnalysisDialog] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  
  // Validate UUID parameter
  if (!id || !isValidUUID(id)) {
    return <Navigate to="/concepts/list" replace />
  }
  
  const { data: concept, isLoading, error } = useQuery({
    queryKey: ['concept', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('concepts')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data
    },
    enabled: !!id && isValidUUID(id),
  })
  
  const { data: analyses } = useQuery({
    queryKey: ['concept-analyses', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('analysis_jobs')
        .select('*')
        .eq('concept_id', id)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    },
    enabled: !!id && isValidUUID(id),
  })

  const { data: developmentSession } = useQuery({
    queryKey: ['development-session', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('concept_development_sessions')
        .select('*')
        .eq('concept_id', id)
        .eq('is_active', true)
        .maybeSingle()
      
      if (error) throw error
      return data
    },
    enabled: !!id && isValidUUID(id),
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
  
  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <p className="text-destructive">Error loading concept: {error.message}</p>
          </CardContent>
        </Card>
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
      <ConceptHeader
        concept={concept}
        developmentSession={developmentSession}
        onStartAnalysis={() => setShowAnalysisDialog(true)}
        onOpenDevelopment={() => setActiveTab('development')}
      />

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
          <ConceptOverviewTab concept={concept} />
        </TabsContent>
        
        <TabsContent value="analysis" className="space-y-4">
          <ConceptAnalysisTab conceptId={concept.id} analyses={analyses} />
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
      
      <StartAnalysisDialog
        conceptId={concept.id}
        conceptName={concept.name}
        open={showAnalysisDialog}
        onOpenChange={setShowAnalysisDialog}
      />
    </div>
  )
}
