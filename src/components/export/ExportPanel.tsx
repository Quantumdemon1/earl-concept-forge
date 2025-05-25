
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  FileText,
  FileJson,
  FileCode,
  Download,
  Loader2,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface ExportPanelProps {
  concept: any
}

export default function ExportPanel({ concept }: ExportPanelProps) {
  const { toast } = useToast()
  const [exportFormat, setExportFormat] = useState('json')
  const [isExporting, setIsExporting] = useState(false)
  const [includeOptions, setIncludeOptions] = useState({
    overview: true,
    earlAnalysis: true,
    developmentHistory: true,
    implementationPlan: true,
    visualizations: false,
  })
  
  const { data: exportData, isLoading } = useQuery({
    queryKey: ['export-data', concept.id],
    queryFn: async () => {
      const [analyses, development, visualizations] = await Promise.all([
        supabase
          .from('concept_analyses')
          .select('*')
          .eq('concept_id', concept.id),
        supabase
          .from('concept_development_sessions')
          .select('*, development_iterations(*)')
          .eq('concept_id', concept.id),
        supabase
          .from('visualizations')
          .select('*')
          .eq('concept_id', concept.id),
      ])
      
      return {
        analyses: analyses.data || [],
        development: development.data || [],
        visualizations: visualizations.data || [],
      }
    },
  })
  
  const handleExport = async () => {
    setIsExporting(true)
    
    try {
      // Compile export data
      const compiledData: any = {
        concept: {
          id: concept.id,
          name: concept.name,
          description: concept.description,
          domains: concept.domains,
          status: concept.status,
          created_at: concept.created_at,
        },
        exported_at: new Date().toISOString(),
      }
      
      if (includeOptions.overview) {
        compiledData.overview = concept
      }
      
      if (includeOptions.earlAnalysis && exportData?.analyses) {
        compiledData.earl_analysis = exportData.analyses
      }
      
      if (includeOptions.developmentHistory && exportData?.development) {
        compiledData.development_history = exportData.development
      }
      
      if (includeOptions.implementationPlan) {
        // Extract implementation plan from latest development
        const latestDev = exportData?.development?.[0]
        if (latestDev) {
          compiledData.implementation_plan = {
            session_id: latestDev.id,
            stage: latestDev.stage,
            iteration_count: latestDev.iteration_count,
            scores: {
              completeness: latestDev.completeness_score,
              confidence: latestDev.confidence_score,
              feasibility: latestDev.feasibility_score,
              novelty: latestDev.novelty_score,
            },
            config: latestDev.config,
          }
        }
      }
      
      if (includeOptions.visualizations && exportData?.visualizations) {
        compiledData.visualizations = exportData.visualizations
      }
      
      // Export based on format
      if (exportFormat === 'json') {
        exportJSON(compiledData, concept.name)
      } else if (exportFormat === 'markdown') {
        exportMarkdown(compiledData, concept.name)
      } else if (exportFormat === 'pdf') {
        await exportPDF(compiledData, concept.name)
      }
      
      toast({
        title: 'Export Successful',
        description: `${concept.name} has been exported as ${exportFormat.toUpperCase()}`,
      })
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
  
  const exportJSON = (data: any, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    })
    downloadBlob(blob, `${filename.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`)
  }
  
  const exportMarkdown = (data: any, filename: string) => {
    let markdown = `# ${data.concept.name}\n\n`
    markdown += `${data.concept.description}\n\n`
    
    if (data.overview) {
      markdown += `## Overview\n\n`
      markdown += `**Status**: ${data.concept.status}\n\n`
      if (data.concept.domains?.length > 0) {
        markdown += `**Domains**: ${data.concept.domains.join(', ')}\n\n`
      }
      markdown += `**Created**: ${new Date(data.concept.created_at).toLocaleDateString()}\n\n`
    }
    
    if (data.development_history?.length > 0) {
      markdown += `## Development History\n\n`
      data.development_history.forEach((session: any) => {
        markdown += `### Session ${session.id}\n\n`
        markdown += `**Stage**: ${session.stage}\n\n`
        markdown += `**Iterations**: ${session.iteration_count}\n\n`
        markdown += `**Scores**:\n`
        markdown += `- Completeness: ${Math.round(session.completeness_score * 100)}%\n`
        markdown += `- Confidence: ${Math.round(session.confidence_score * 100)}%\n`
        markdown += `- Feasibility: ${Math.round(session.feasibility_score * 100)}%\n`
        markdown += `- Novelty: ${Math.round(session.novelty_score * 100)}%\n\n`
      })
    }
    
    if (data.implementation_plan) {
      markdown += `## Implementation Plan\n\n`
      markdown += `**Current Stage**: ${data.implementation_plan.stage}\n\n`
      markdown += `**Progress**: ${data.implementation_plan.iteration_count} iterations completed\n\n`
    }
    
    if (data.earl_analysis?.length > 0) {
      markdown += `## EARL Analysis Results\n\n`
      data.earl_analysis.forEach((analysis: any, index: number) => {
        markdown += `### Analysis ${index + 1}\n\n`
        markdown += `**Stage**: ${analysis.stage}\n\n`
        markdown += `**Version**: ${analysis.version}\n\n`
        if (analysis.confidence_scores) {
          markdown += `**Confidence Scores**: ${JSON.stringify(analysis.confidence_scores)}\n\n`
        }
      })
    }
    
    const blob = new Blob([markdown], { type: 'text/markdown' })
    downloadBlob(blob, `${filename.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`)
  }
  
  const exportPDF = async (data: any, filename: string) => {
    // PDF export would require a library like jsPDF or similar
    // For now, we'll export as markdown and show a message
    exportMarkdown(data, filename)
    toast({
      title: 'PDF Export',
      description: 'PDF export is not yet available. Exported as Markdown instead.',
    })
  }
  
  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
  
  const toggleIncludeOption = (key: string) => {
    setIncludeOptions(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }))
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Export Format</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={exportFormat} onValueChange={setExportFormat}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="json" id="json" />
              <Label htmlFor="json" className="flex items-center gap-2 cursor-pointer">
                <FileJson className="h-4 w-4" />
                JSON (Complete Data)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="markdown" id="markdown" />
              <Label htmlFor="markdown" className="flex items-center gap-2 cursor-pointer">
                <FileText className="h-4 w-4" />
                Markdown (Documentation)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="pdf" id="pdf" />
              <Label htmlFor="pdf" className="flex items-center gap-2 cursor-pointer">
                <FileCode className="h-4 w-4" />
                PDF (Presentation) - Coming Soon
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Include in Export</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(includeOptions).map(([key, value]) => (
            <div key={key} className="flex items-center space-x-2">
              <Checkbox
                id={key}
                checked={value}
                onCheckedChange={() => toggleIncludeOption(key)}
              />
              <Label htmlFor={key} className="capitalize cursor-pointer">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button 
          onClick={handleExport} 
          size="lg"
          disabled={isExporting}
        >
          {isExporting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          {isExporting ? 'Exporting...' : 'Export Concept'}
        </Button>
      </div>
    </div>
  )
}
