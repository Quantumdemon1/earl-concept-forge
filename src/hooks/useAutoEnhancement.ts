
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import type { CompiledDeliverable } from '@/services/deliverableCompiler'
import type { EnhancementQuestion } from '@/services/gapAnalysisService'

interface QuestionAnswer {
  questionId: string
  question: string
  answer: string
  category: string
  section: string
}

interface AutoEnhancementResult {
  enhancedDeliverable: CompiledDeliverable
  enhancedSections: string[]
  qualityAnalysis: any
  improvementSummary: string
}

export function useAutoEnhancement() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [processingQuestions, setProcessingQuestions] = useState<Set<string>>(new Set())

  const enhanceDeliverableMutation = useMutation({
    mutationFn: async ({
      conceptId,
      deliverable,
      questionAnswers,
      targetSections
    }: {
      conceptId: string
      deliverable: CompiledDeliverable
      questionAnswers: QuestionAnswer[]
      targetSections?: string[]
    }): Promise<AutoEnhancementResult> => {
      console.log('Starting auto-enhancement:', { conceptId, questionCount: questionAnswers.length })

      const { data, error } = await supabase.functions.invoke('auto-enhance-deliverable', {
        body: {
          conceptId,
          deliverable,
          questionAnswers,
          targetSections
        }
      })

      if (error) {
        console.error('Auto-enhancement error:', error)
        throw new Error(error.message || 'Failed to enhance deliverable')
      }

      return data
    },
    onSuccess: (result) => {
      toast({
        title: 'Deliverable Enhanced',
        description: result.improvementSummary,
      })
      
      // Invalidate relevant queries to trigger refresh
      queryClient.invalidateQueries({ queryKey: ['compilation-data'] })
      queryClient.invalidateQueries({ queryKey: ['export-data'] })
    },
    onError: (error) => {
      console.error('Enhancement failed:', error)
      toast({
        title: 'Enhancement Failed',
        description: error instanceof Error ? error.message : 'Failed to enhance deliverable',
        variant: 'destructive',
      })
    }
  })

  const processQuestion = async (
    conceptId: string,
    deliverable: CompiledDeliverable,
    question: EnhancementQuestion,
    answer: string
  ) => {
    if (!answer.trim()) return

    setProcessingQuestions(prev => new Set([...prev, question.id]))

    try {
      const questionAnswer: QuestionAnswer = {
        questionId: question.id,
        question: question.question,
        answer: answer.trim(),
        category: question.category,
        section: question.category // Map category to section for now
      }

      const result = await enhanceDeliverableMutation.mutateAsync({
        conceptId,
        deliverable,
        questionAnswers: [questionAnswer]
      })

      return result
    } finally {
      setProcessingQuestions(prev => {
        const newSet = new Set(prev)
        newSet.delete(question.id)
        return newSet
      })
    }
  }

  const processBatchQuestions = async (
    conceptId: string,
    deliverable: CompiledDeliverable,
    questionAnswers: QuestionAnswer[]
  ) => {
    if (questionAnswers.length === 0) return

    const questionIds = questionAnswers.map(qa => qa.questionId)
    setProcessingQuestions(prev => new Set([...prev, ...questionIds]))

    try {
      const result = await enhanceDeliverableMutation.mutateAsync({
        conceptId,
        deliverable,
        questionAnswers
      })

      return result
    } finally {
      setProcessingQuestions(prev => {
        const newSet = new Set(prev)
        questionIds.forEach(id => newSet.delete(id))
        return newSet
      })
    }
  }

  return {
    processQuestion,
    processBatchQuestions,
    isProcessing: enhanceDeliverableMutation.isPending,
    isQuestionProcessing: (questionId: string) => processingQuestions.has(questionId),
    error: enhanceDeliverableMutation.error
  }
}
