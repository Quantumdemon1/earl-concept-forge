
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import ExportFormatSelector from './ExportFormatSelector'
import ExportOptionsSelector from './ExportOptionsSelector'
import ExportButton from './ExportButton'
import { exportJSON, exportMarkdown, exportPDF, compileExportData } from '@/utils/exportUtils'

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
  
  const handleExport = async () => {
    setIsExporting(true)
    
    try {
      const compiledData = compileExportData(concept, exportData, includeOptions)
      
      // Export based on format
      if (exportFormat === 'json') {
        exportJSON(compiledData, concept.name)
      } else if (exportFormat === 'markdown') {
        exportMarkdown(compiledData, concept.name)
      } else if (exportFormat === 'pdf') {
        await exportPDF(compiledData, concept.name, toast)
      }
      
      toast({
        title: 'Export Successful',
        description: `${concept.name} has been exported as ${exportFormat.toUpperCase()} with complete development data including LLM interactions, prompts, and responses.`,
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
  
  return (
    <div className="space-y-6">
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">Export Includes:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Complete LLM interactions and responses</li>
          <li>• Detailed prompts used in each iteration</li>
          <li>• Extracted components, research, and validations</li>
          <li>• Quality scores and progression metrics</li>
          <li>• Development session configurations</li>
          <li>• EARL analysis results and outputs</li>
        </ul>
      </div>
      
      <ExportFormatSelector 
        value={exportFormat} 
        onChange={setExportFormat} 
      />
      
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
