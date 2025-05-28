
import { useState, useEffect } from 'react'
import WorkflowProgressCard from './WorkflowProgressCard'
import WorkflowTabsContent from './WorkflowTabsContent'
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
  conceptId: string
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
  conceptId,
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
        conceptId,
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
      <WorkflowProgressCard
        workflowSteps={workflowSteps}
        overallReadiness={overallReadiness}
        hasSmartEnhancement={!!smartQuestions?.nextBestQuestion}
        onSmartEnhancement={handleSmartEnhancement}
        isProcessing={isProcessing}
      />

      <WorkflowTabsContent
        activeTab={activeTab}
        onTabChange={setActiveTab}
        compiledDeliverable={compiledDeliverable}
        gapAnalysis={gapAnalysis}
        enhancementQuestions={enhancementQuestions}
        conceptName={conceptName}
        smartQuestions={smartQuestions}
        isLoadingSmartQuestions={isLoadingSmartQuestions}
        answeredQuestions={answeredQuestions}
        appliedEnhancements={appliedEnhancements}
        onAnswerQuestion={handleAnswerQuestion}
        onApplyEnhancement={handleApplyEnhancement}
        isQuestionProcessing={isQuestionProcessing}
        isProcessing={isProcessing}
        onRecompile={onRecompile}
        onExport={onExport}
        isRecompiling={isRecompiling}
        isExporting={isExporting}
        overallReadiness={overallReadiness}
      />
    </div>
  )
}
