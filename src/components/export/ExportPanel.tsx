
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertCircle, Download, RefreshCw, FileText, Settings } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import ExportFormatSelector from './ExportFormatSelector'
import ExportOptionsSelector from './ExportOptionsSelector'
import DeliverableTemplateSelector from './DeliverableTemplateSelector'
import ExportWorkflow from './ExportWorkflow'
import { DeliverableCompilerService } from '@/services/deliverableCompiler'
import { GapAnalysisService } from '@/services/gapAnalysisService'
import * as exportUtils from '@/utils/exportUtils'
import type { CompiledDeliverable } from '@/services/deliverableCompiler'
import type { GapAnalysisResult } from '@/services/gapAnalysisService'
import type { EnhancementQuestion } from '@/services/gapAnalysisService'

interface ExportPanelProps {
  conceptId: string
  conceptName: string
  conceptData: any
}

export default function ExportPanel({ conceptId, conceptName, conceptData }: ExportPanelProps) {
  const { toast } = useToast()
  const [compiledDeliverable, setCompiledDeliverable] = useState<CompiledDeliverable | null>(null)
  const [gapAnalysis, setGapAnalysis] = useState<GapAnalysisResult | null>(null)
  const [enhancementQuestions, setEnhancementQuestions] = useState<EnhancementQuestion[]>([])
  const [selectedFormat, setSelectedFormat] = useState('docx')
  const [selectedTemplate, setSelectedTemplate] = useState('default')
  const [exportOptions, setExportOptions] = useState({
    overview: true,
    earlAnalysis: true,
    developmentHistory: false,
    implementationPlan: true,
    visualizations: false,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isRecompiling, setIsRecompiling] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    if (!compiledDeliverable) {
      toast({
        title: 'Deliverable Not Ready',
        description: 'Please compile the deliverable before exporting.',
        variant: 'destructive',
      })
      return
    }

    setIsExporting(true)
    try {
      const blob = await exportUtils.generateExport(
        compiledDeliverable,
        selectedFormat,
        selectedTemplate,
        exportOptions
      )

      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${conceptName}.${selectedFormat}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      toast({
        title: 'Deliverable Exported',
        description: `Successfully exported ${conceptName} as ${selectedFormat.toUpperCase()}`,
      })
    } catch (error) {
      console.error('Export failed:', error)
      toast({
        title: 'Export Failed',
        description: 'Please try again or check your export settings.',
        variant: 'destructive',
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleRecompile = async () => {
    setIsRecompiling(true)
    try {
      const newCompiled = await DeliverableCompilerService.compileFromDevelopmentData(conceptData.concept, conceptData)
      setCompiledDeliverable(newCompiled)

      const newGapAnalysis = await GapAnalysisService.analyzeDeliverableGaps(newCompiled)
      setGapAnalysis(newGapAnalysis)

      const newQuestions = await GapAnalysisService.generateEnhancementQuestions(newCompiled)
      setEnhancementQuestions(newQuestions)

      toast({
        title: 'Deliverable Recompiled',
        description: 'Updated with latest concept data and enhancements',
      })
    } catch (error) {
      console.error('Recompilation failed:', error)
      toast({
        title: 'Recompilation Failed',
        description: 'Please try again or check your concept data',
        variant: 'destructive',
      })
    } finally {
      setIsRecompiling(false)
    }
  }

  const handleFormatChange = (format: string) => {
    setSelectedFormat(format)
  }

  const handleTemplateChange = (template: string) => {
    setSelectedTemplate(template)
  }

  const handleOptionsChange = (key: string, value: boolean) => {
    setExportOptions(prev => ({
      ...prev,
      [key]: value
    }))
  }

  useEffect(() => {
    const compileInitialDeliverable = async () => {
      setIsLoading(true)
      try {
        const initialCompiled = await DeliverableCompilerService.compileFromDevelopmentData(conceptData.concept || conceptData, conceptData)
        setCompiledDeliverable(initialCompiled)

        const initialGapAnalysis = await GapAnalysisService.analyzeDeliverableGaps(initialCompiled)
        setGapAnalysis(initialGapAnalysis)

        const initialQuestions = await GapAnalysisService.generateEnhancementQuestions(initialCompiled)
        setEnhancementQuestions(initialQuestions)
      } catch (error) {
        console.error('Initial compilation failed:', error)
        toast({
          title: 'Initial Compilation Failed',
          description: 'Please check your concept data.',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }

    compileInitialDeliverable()
  }, [conceptData, toast])

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 animate-spin" />
            <span>Compiling deliverable...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!compiledDeliverable || !gapAnalysis) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <span>Failed to compile deliverable. Please check your concept data.</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="workflow" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="workflow">Smart Export Workflow</TabsTrigger>
          <TabsTrigger value="manual">Manual Export</TabsTrigger>
        </TabsList>

        <TabsContent value="workflow" className="space-y-4">
          <ExportWorkflow
            compiledDeliverable={compiledDeliverable}
            gapAnalysis={gapAnalysis}
            enhancementQuestions={enhancementQuestions}
            conceptName={conceptName}
            conceptId={conceptId}
            onRecompile={handleRecompile}
            onExport={handleExport}
            isRecompiling={isRecompiling}
            isExporting={isExporting}
          />
        </TabsContent>

        <TabsContent value="manual" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Manual Export Options</CardTitle>
              <CardContent>
                Configure export format, template, and options for manual deliverable
                generation.
              </CardContent>
            </CardHeader>
            <CardContent className="space-y-4">
              <ExportFormatSelector
                value={selectedFormat}
                onChange={handleFormatChange}
              />
              <DeliverableTemplateSelector
                value={selectedTemplate}
                onChange={handleTemplateChange}
              />
              <ExportOptionsSelector
                options={exportOptions}
                onChange={handleOptionsChange}
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  {isExporting ? 'Exporting...' : 'Generate Deliverable'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
