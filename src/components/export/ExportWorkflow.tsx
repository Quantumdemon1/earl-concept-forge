
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckCircle, Circle, Download, RefreshCw } from 'lucide-react'
import DeliverableQualityDashboard from './DeliverableQualityDashboard'
import EnhancementSuggestions from './EnhancementSuggestions'
import type { CompiledDeliverable } from '@/services/deliverableCompiler'
import type { GapAnalysisResult } from '@/services/gapAnalysisService'
import type { EnhancementQuestion } from '@/services/gapAnalysisService'

interface ExportWorkflowProps {
  compiledDeliverable: CompiledDeliverable
  gapAnalysis: GapAnalysisResult
  enhancementQuestions: EnhancementQuestion[]
  conceptName: string
  onRecompile: () => void
  onExport: () => void
  isRecompiling?: boolean
  isExporting?: boolean
}

export default function ExportWorkflow({
  compiledDeliverable,
  gapAnalysis,
  enhancementQuestions,
  conceptName,
  onRecompile,
  onExport,
  isRecompiling = false,
  isExporting = false
}: ExportWorkflowProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [appliedEnhancements, setAppliedEnhancements] = useState<string[]>([])

  const workflowSteps = [
    {
      id: 'analysis',
      label: 'Quality Analysis',
      completed: true,
      description: 'Deliverable analyzed for completeness and quality'
    },
    {
      id: 'gaps',
      label: 'Gap Detection',
      completed: gapAnalysis.missingComponents.length < 3,
      description: 'Missing components and weak sections identified'
    },
    {
      id: 'enhancement',
      label: 'Enhancement',
      completed: appliedEnhancements.length > 0,
      description: 'Improvements applied based on suggestions'
    },
    {
      id: 'export',
      label: 'Export Ready',
      completed: gapAnalysis.qualityAnalysis.completenessScore > 75,
      description: 'Deliverable ready for professional export'
    }
  ]

  const overallReadiness = workflowSteps.filter(step => step.completed).length / workflowSteps.length * 100

  const handleApplyEnhancement = (enhancement: any) => {
    setAppliedEnhancements(prev => [...prev, enhancement.section])
  }

  const handleAnswerQuestion = (questionId: string, answer: string) => {
    console.log('Question answered:', questionId, answer)
    // In a real implementation, this would trigger AI development to improve the deliverable
  }

  return (
    <div className="space-y-6">
      {/* Workflow Progress */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Export Workflow Progress</CardTitle>
            <Badge variant={overallReadiness >= 75 ? 'default' : 'outline'}>
              {Math.round(overallReadiness)}% Ready
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {workflowSteps.map((step, index) => (
              <div
                key={step.id}
                className={`p-4 rounded-lg border ${
                  step.completed 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {step.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-400" />
                  )}
                  <span className="font-medium text-sm">{step.label}</span>
                </div>
                <p className="text-xs text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Quality Overview</TabsTrigger>
          <TabsTrigger value="enhancement">Enhancements</TabsTrigger>
          <TabsTrigger value="export">Export Options</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <DeliverableQualityDashboard
            qualityAnalysis={gapAnalysis.qualityAnalysis}
            gapAnalysis={gapAnalysis}
            conceptName={conceptName}
          />
        </TabsContent>

        <TabsContent value="enhancement" className="space-y-4">
          <EnhancementSuggestions
            suggestions={gapAnalysis.qualityAnalysis.suggestions}
            questions={enhancementQuestions}
            onApplySuggestion={handleApplyEnhancement}
            onAnswerQuestion={handleAnswerQuestion}
          />
          
          {appliedEnhancements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Applied Enhancements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {appliedEnhancements.map((enhancement, index) => (
                    <Badge key={index} variant="outline">
                      {enhancement}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Export Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <Button
                  onClick={onRecompile}
                  disabled={isRecompiling}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${isRecompiling ? 'animate-spin' : ''}`} />
                  Recompile Deliverable
                </Button>
                
                <Button
                  onClick={onExport}
                  disabled={isExporting || overallReadiness < 50}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export Deliverable
                </Button>
              </div>
              
              {overallReadiness < 50 && (
                <p className="text-sm text-amber-600">
                  Complete more workflow steps to enable export
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
