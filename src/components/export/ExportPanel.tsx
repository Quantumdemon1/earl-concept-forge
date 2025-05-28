
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Loader2, AlertTriangle, CheckCircle, Info } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ExportFormatSelector from './ExportFormatSelector'
import ExportOptionsSelector from './ExportOptionsSelector'
import ExportButton from './ExportButton'
import DeliverableTemplateSelector from './DeliverableTemplateSelector'
import ExportWorkflow from './ExportWorkflow'
import { exportJSON, exportMarkdown, exportPDF, exportDeliverableTemplate, compileExportData } from '@/utils/exportUtils'
import { GapAnalysisService } from '@/services/gapAnalysisService'

interface ExportPanelProps {
  concept: any
}

export default function ExportPanel({ concept }: ExportPanelProps) {
  const { toast } = useToast()
  const [exportFormat, setExportFormat] = useState('deliverable')
  const [selectedTemplate, setSelectedTemplate] = useState('Executive Summary')
  const [isExporting, setIsExporting] = useState(false)
  const [showGapAnalysis, setShowGapAnalysis] = useState(false)
  const [isRecompiling, setIsRecompiling] = useState(false)
  const [includeOptions, setIncludeOptions] = useState({
    overview: true,
    earlAnalysis: true,
    developmentHistory: true,
    implementationPlan: true,
    visualizations: false,
  })
  
  const { data: exportData, isLoading, refetch } = useQuery({
    queryKey: ['export-data', concept.id],
    queryFn: async () => {
      const [analyses, development, visualizations, developmentIterations] = await Promise.all([
        supabase
          .from('concept_analyses')
          .select('*')
          .eq('concept_id', concept.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('concept_development_sessions')
          .select('*')
          .eq('concept_id', concept.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('visualizations')
          .select('*')
          .eq('concept_id', concept.id)
          .order('created_at', { ascending: false }),
        // Fetch development iterations for additional detail
        supabase
          .from('development_iterations')
          .select(`
            *,
            session:concept_development_sessions!session_id(*)
          `)
          .eq('session.concept_id', concept.id)
          .order('created_at', { ascending: false })
      ])
      
      // Enhanced development data with iterations
      const enhancedDevelopment = development.data?.map(session => ({
        ...session,
        development_iterations: developmentIterations.data?.filter(
          iter => iter.session_id === session.id
        ) || []
      })) || []
      
      return {
        analyses: analyses.data || [],
        development: enhancedDevelopment,
        visualizations: visualizations.data || [],
        developmentIterations: developmentIterations.data || []
      }
    },
  })
  
  // Compiled deliverable and gap analysis
  const { data: compilationData } = useQuery({
    queryKey: ['compilation-data', concept.id, exportData],
    queryFn: async () => {
      if (!exportData?.development || exportData.development.length === 0) {
        return null
      }
      
      const compiledData = compileExportData(concept, exportData, includeOptions)
      if (!compiledData.compiledDeliverable) {
        return null
      }

      const gapAnalysis = GapAnalysisService.analyzeDeliverableGaps(compiledData.compiledDeliverable)
      const enhancementQuestions = GapAnalysisService.generateEnhancementQuestions(compiledData.compiledDeliverable)
      
      return {
        compiledDeliverable: compiledData.compiledDeliverable,
        gapAnalysis,
        enhancementQuestions
      }
    },
    enabled: !!exportData?.development && exportData.development.length > 0
  })

  const handleExport = async () => {
    setIsExporting(true)
    
    try {
      const compiledData = compileExportData(concept, exportData, includeOptions)
      
      // Export based on format
      if (exportFormat === 'deliverable' && compiledData.compiledDeliverable) {
        exportDeliverableTemplate(compiledData.compiledDeliverable, selectedTemplate, concept.name)
        toast({
          title: 'Deliverable Exported',
          description: `${concept.name} deliverable has been exported as ${selectedTemplate} template.`,
        })
      } else if (exportFormat === 'json') {
        exportJSON(compiledData, concept.name)
        toast({
          title: 'Export Successful',
          description: `${concept.name} has been exported as JSON with complete development data.`,
        })
      } else if (exportFormat === 'markdown') {
        exportMarkdown(compiledData, concept.name)
        toast({
          title: 'Export Successful',
          description: `${concept.name} has been exported as Markdown with structured deliverable.`,
        })
      } else if (exportFormat === 'pdf') {
        await exportPDF(compiledData, concept.name, toast)
      } else {
        // Fallback to markdown if no deliverable compiled
        exportMarkdown(compiledData, concept.name)
        toast({
          title: 'Export Complete',
          description: `${concept.name} exported as Markdown. Complete AI development for deliverable templates.`,
        })
      }
    } catch (error) {
      console.error('Export error:', error)
      toast({
        title: 'Export Failed',
        description: 'There was an error exporting your concept',
        variant: 'destructive',
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleRecompile = async () => {
    setIsRecompiling(true)
    try {
      await refetch()
      toast({
        title: 'Deliverable Recompiled',
        description: 'The deliverable has been recompiled with the latest data.',
      })
    } catch (error) {
      toast({
        title: 'Recompilation Failed',
        description: 'There was an error recompiling the deliverable',
        variant: 'destructive',
      })
    } finally {
      setIsRecompiling(false)
    }
  }
  
  const toggleIncludeOption = (key: string, value: boolean) => {
    setIncludeOptions(prev => ({
      ...prev,
      [key]: value
    }))
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }
  
  const hasCompletedDevelopment = exportData?.development && exportData.development.length > 0

  // Enhanced export with workflow
  if (hasCompletedDevelopment && compilationData) {
    return (
      <div className="space-y-6">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Smart Export Ready:</h3>
          <p className="text-sm text-blue-800">
            Your concept has completed AI development. Use the enhanced export workflow below to create professional deliverables with quality analysis and improvement suggestions.
          </p>
        </div>

        <ExportWorkflow
          compiledDeliverable={compilationData.compiledDeliverable}
          gapAnalysis={compilationData.gapAnalysis}
          enhancementQuestions={compilationData.enhancementQuestions}
          conceptName={concept.name}
          onRecompile={handleRecompile}
          onExport={handleExport}
          isRecompiling={isRecompiling}
          isExporting={isExporting}
        />

        <Tabs defaultValue="format" className="w-full">
          <TabsList>
            <TabsTrigger value="format">Export Settings</TabsTrigger>
            <TabsTrigger value="legacy">Legacy Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="format" className="space-y-4">
            <ExportFormatSelector 
              value={exportFormat} 
              onChange={setExportFormat} 
              hasCompletedDevelopment={hasCompletedDevelopment}
            />
            
            {exportFormat === 'deliverable' && (
              <DeliverableTemplateSelector 
                value={selectedTemplate}
                onChange={setSelectedTemplate}
              />
            )}
            
            <ExportOptionsSelector 
              options={includeOptions}
              onChange={toggleIncludeOption}
            />
            
            <ExportButton 
              onClick={handleExport}
              isExporting={isExporting}
            />
          </TabsContent>

          <TabsContent value="legacy" className="space-y-4">
            {/* Legacy gap analysis display */}
            {compilationData.gapAnalysis && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Legacy Quality Assessment</h3>
                  <button
                    onClick={() => setShowGapAnalysis(!showGapAnalysis)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    {showGapAnalysis ? 'Hide Details' : 'Show Details'}
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-white border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{compilationData.gapAnalysis.qualityAnalysis.completenessScore}%</div>
                    <div className="text-sm text-gray-600">Completeness</div>
                  </div>
                  <div className="text-center p-3 bg-white border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{compilationData.gapAnalysis.qualityAnalysis.actionabilityScore}%</div>
                    <div className="text-sm text-gray-600">Actionability</div>
                  </div>
                  <div className="text-center p-3 bg-white border rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{compilationData.gapAnalysis.qualityAnalysis.clarityScore}%</div>
                    <div className="text-sm text-gray-600">Clarity</div>
                  </div>
                  <div className="text-center p-3 bg-white border rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{compilationData.gapAnalysis.qualityAnalysis.marketReadinessScore}%</div>
                    <div className="text-sm text-gray-600">Market Ready</div>
                  </div>
                </div>

                {showGapAnalysis && (
                  <div className="space-y-4">
                    {compilationData.gapAnalysis.qualityAnalysis.suggestions.length > 0 && (
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <div className="space-y-2">
                            <div className="font-medium">Improvement Suggestions:</div>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                              {compilationData.gapAnalysis.qualityAnalysis.suggestions.slice(0, 3).map((suggestion, index) => (
                                <li key={index}>
                                  <span className="font-medium">{suggestion.section}:</span> {suggestion.suggestion}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </AlertDescription>
                      </Alert>
                    )}

                    {compilationData.gapAnalysis.missingComponents.length > 0 && (
                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                          <div className="space-y-2">
                            <div className="font-medium">Missing Components:</div>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                              {compilationData.gapAnalysis.missingComponents.slice(0, 3).map((component, index) => (
                                <li key={index}>{component}</li>
                              ))}
                            </ul>
                          </div>
                        </AlertDescription>
                      </Alert>
                    )}

                    {compilationData.gapAnalysis.recommendedActions.length > 0 && (
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          <div className="space-y-2">
                            <div className="font-medium">Recommended Actions:</div>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                              {compilationData.gapAnalysis.recommendedActions.slice(0, 3).map((action, index) => (
                                <li key={index}>{action}</li>
                              ))}
                            </ul>
                          </div>
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    )
  }

  // Fallback to basic export for concepts without development
  return (
    <div className="space-y-6">
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">Enhanced Export Features:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>Smart Deliverables</strong>: Compiled project specifications from AI development</li>
          <li>• <strong>Multiple Templates</strong>: Executive summaries, technical specs, business plans</li>
          <li>• <strong>Gap Analysis</strong>: Automated assessment of deliverable completeness</li>
          <li>• <strong>Enhancement Suggestions</strong>: AI-powered recommendations for improvement</li>
          <li>• Complete LLM interactions and development history</li>
          <li>• EARL analysis results and validation data</li>
        </ul>
      </div>
      
      <ExportFormatSelector 
        value={exportFormat} 
        onChange={setExportFormat} 
        hasCompletedDevelopment={hasCompletedDevelopment}
      />
      
      {exportFormat === 'deliverable' && hasCompletedDevelopment && (
        <DeliverableTemplateSelector 
          value={selectedTemplate}
          onChange={setSelectedTemplate}
        />
      )}
      
      <ExportOptionsSelector 
        options={includeOptions}
        onChange={toggleIncludeOption}
      />
      
      <ExportButton 
        onClick={handleExport}
        isExporting={isExporting}
      />
    </div>
  )
}
