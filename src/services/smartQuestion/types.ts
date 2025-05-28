
import type { CompiledDeliverable } from '../deliverableCompiler'
import type { QualityAnalysis } from '../deliverableEnhancer'

export interface SmartQuestionResult {
  prioritizedQuestions: any[]
  nextBestQuestion: any | null
  completionStrategy: string
  estimatedTimeToComplete: number
  totalQuestions: number
}

export interface SmartQuestion {
  id: string
  category: 'technical' | 'market' | 'business' | 'implementation'
  question: string
  purpose: string
  priority: 'high' | 'medium' | 'low'
  impact: number
}

export interface AnsweredQuestion {
  questionId: string
  answer: string
  category: string
}
