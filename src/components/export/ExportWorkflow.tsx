
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckCircle, Circle, Download, RefreshCw, Brain, Zap } from 'lucide-react'
import DeliverableQualityDashboard from './DeliverableQualityDashboard'
import EnhancementSuggestions from './EnhancementSuggestions'
import SmartQuestionPanel from './SmartQuestionPanel'
import { useAutoEnhancement } from '@/hooks/useAutoEnhancement'
import { SmartQuestionService } from '@/services/smartQuestionService'
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
  const [answeredQuestions, setAnsweredQuestions] = useState<Array<{
    questionId: string
    answer: string
    category: string
  }>>([])
  const [smartQuestions, setSmartQuestions] = useState<any>(null)
  const [isLoadingSmartQuestions, setIsLoadingSmartQuestions] = useState(false)

  const { processQuestion, processBatchQuestions, isProcessing, isQuestionProcessing } = useAutoEnhancement()

  // Load smart questions on component mount
  useEffect(() => {
    loadSmartQuestions()
  }, [compiledDeliverable, gapAnalysis, answeredQuestions])

  const loadSmartQuestions = async () => {
    setIsLoadingSmartQuestions(true)
    try {
      const result = await SmartQuestionService.prioritizeQuestions(
        compiledDeliverable,
        gapAnalysis.qualityAnalysis,
        answeredQuestions
      )
      setSmartQuestions(result)
    } catch (error) {
      console.error('Failed to load smart questions:', error)
    } finally {
      setIsLoadingSmartQuestions(false)
    }
  }

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
      label: 'AI Enhancement',
      completed: appliedEnhancements.length > 0 || answeredQuestions.length > 2,
      description: 'AI-powered improvements applied based on smart questions'
    },
    {
      id: 'export',
      label: 'Export Ready',
      completed: gapAnalysis.qualityAnalysis.completenessScore > 75 && answeredQuestions.length > 1,
      description: 'Deliverable ready for professional export'
    }
  ]

  const overallReadiness = workflowSteps.filter(step => step.completed).length / workflowSteps.length * 100

  const handleApplyEnhancement = (enhancement: any) => {
    setAppliedEnhancements(prev => [...prev, enhancement.section])
  }

  const handleAnswerQuestion = async (questionId: string, answer: string) => {
    const question = [...enhancementQuestions, ...(smartQuestions?.prioritizedQuestions || [])]
      .find(q => q.id === questionId)
    
    if (!question) return

    try {
      const result = await processQuestion(
        'concept-id', // This should come from props
        compiledDeliverable,
        question,
        answer
      )

      if (result) {
        setAnsweredQuestions(prev => [...prev, {
          questionId,
          answer,
          category: question.category
        }])

        // Trigger recompilation to get updated deliverable
        onRecompile()
      }
    } catch (error) {
      console.error('Failed to process question:', error)
    }
  }

  const handleSmartEnhancement = async () => {
    if (!smartQuestions?.nextBestQuestion) return

    const nextQuestion = smartQuestions.nextBestQuestion
    setActiveTab('smart-questions')
  }

  return (
    <div className="space-y-6">
      {/* Workflow Progress */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Smart Export Workflow
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant={overallReadiness >= 75 ? 'default' : 'outline'}>
                {Math.round(overallReadiness)}% Ready
              </Badge>
              {smartQuestions?.nextBestQuestion && (
                <Button
                  size="sm"
                  onClick={handleSmartEnhancement}
                  className="flex items-center gap-1"
                  disabled={isProcessing}
                >
                  <Zap className="h-3 w-3" />
                  Smart Enhance
                </Button>
              )}
            </div>
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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Quality Overview</TabsTrigger>
          <TabsTrigger value="smart-questions">
            Smart Questions
            {smartQuestions?.nextBestQuestion && (
              <Badge className="ml-1 h-4 w-4 p-0 text-xs">!</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="enhancement">Manual Enhancements</TabsTrigger>
          <TabsTrigger value="export">Export Options</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <DeliverableQualityDashboard
            qualityAnalysis={gapAnalysis.qualityAnalysis}
            gapAnalysis={gapAnalysis}
            conceptName={conceptName}
          />
        </TabsContent>

        <TabsContent value="smart-questions" className="space-y-4">
          <SmartQuestionPanel
            smartQuestions={smartQuestions}
            isLoading={isLoadingSmartQuestions}
            answeredQuestions={answeredQuestions}
            onAnswerQuestion={handleAnswerQuestion}
            isProcessingQuestion={isQuestionProcessing}
            isProcessing={isProcessing}
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

              {smartQuestions && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Completion Strategy:</strong> {smartQuestions.completionStrategy}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Estimated time: {smartQuestions.estimatedTimeToComplete} minutes
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
