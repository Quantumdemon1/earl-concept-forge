
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { projectService } from '@/services/projectService'
import ConceptHeader from '@/components/concept/ConceptHeader'
import ConceptOverviewTab from '@/components/concept/ConceptOverviewTab'
import ConceptAnalysisTab from '@/components/concept/ConceptAnalysisTab'
import DevelopmentPanel from '@/components/development/DevelopmentPanel'
import ExportPanel from '@/components/export/ExportPanel'

export default function ConceptDetail() {
  const { id: conceptId } = useParams()
  const { toast } = useToast()
  const [concept, setConcept] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [exportData, setExportData] = useState<any>(null)

  useEffect(() => {
    if (!conceptId) {
      toast({
        title: 'Missing Concept ID',
        description: 'No concept ID provided in the URL.',
        variant: 'destructive',
      })
      return
    }

    const fetchConcept = async () => {
      setIsLoading(true)
      try {
        const data = await projectService.getConceptById(conceptId)
        setConcept(data.concept)
        setExportData(data)
      } catch (error) {
        console.error('Error fetching concept:', error)
        toast({
          title: 'Error Fetching Concept',
          description: 'Failed to load concept details. Please try again.',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchConcept()
  }, [conceptId, toast])

  if (isLoading) {
    return <div>Loading concept details...</div>
  }

  if (!concept) {
    return <div>Concept not found.</div>
  }

  return (
    <div className="space-y-6">
      <ConceptHeader 
        concept={concept}
        onStartAnalysis={() => {}}
        onOpenDevelopment={() => {}}
      />
      
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="development">Development</TabsTrigger>
          <TabsTrigger value="export">Export & Deliverables</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <ConceptOverviewTab concept={concept} />
        </TabsContent>

        <TabsContent value="analysis">
          <ConceptAnalysisTab 
            conceptId={concept.id} 
            analyses={exportData?.analyses}
          />
        </TabsContent>

        <TabsContent value="development">
          <DevelopmentPanel 
            conceptId={concept.id}
            conceptName={concept.name}
          />
        </TabsContent>

        <TabsContent value="export">
          <ExportPanel 
            conceptId={concept.id}
            conceptName={concept.name}
            conceptData={exportData}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
