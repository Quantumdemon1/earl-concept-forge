
import type { CompiledDeliverable } from './deliverableCompiler'
import type { QualityAnalysis } from './deliverableEnhancer/types'
import type { SmartQuestionResult, AnsweredQuestion } from './smartQuestion/types'
import { QuestionGenerator } from './smartQuestion/questionGenerator'
import { QuestionPrioritizer } from './smartQuestion/prioritizer'
import { StrategyGenerator } from './smartQuestion/strategyGenerator'

export class SmartQuestionService {
  static async prioritizeQuestions(
    deliverable: CompiledDeliverable,
    qualityAnalysis: QualityAnalysis,
    answeredQuestions: AnsweredQuestion[]
  ): Promise<SmartQuestionResult> {
    console.log('Prioritizing smart questions:', { deliverable, qualityAnalysis, answeredQuestions })

    // Generate questions based on quality gaps
    const questions = QuestionGenerator.generateQuestionsFromGaps(deliverable, qualityAnalysis)
    
    // Filter out already answered questions
    const answeredIds = new Set(answeredQuestions.map(q => q.questionId))
    const unansweredQuestions = questions.filter(q => !answeredIds.has(q.id))

    // Prioritize questions based on impact and current gaps
    const prioritizedQuestions = QuestionPrioritizer.prioritizeByImpact(unansweredQuestions, qualityAnalysis)

    // Determine next best question
    const nextBestQuestion = prioritizedQuestions.length > 0 ? prioritizedQuestions[0] : null

    // Generate completion strategy
    const completionStrategy = StrategyGenerator.generateCompletionStrategy(qualityAnalysis, answeredQuestions.length)

    // Estimate time to complete
    const estimatedTimeToComplete = StrategyGenerator.estimateCompletionTime(prioritizedQuestions.length, qualityAnalysis)

    return {
      prioritizedQuestions,
      nextBestQuestion,
      completionStrategy,
      estimatedTimeToComplete,
      totalQuestions: questions.length
    }
  }
}

// Re-export types for backward compatibility
export type { SmartQuestionResult, AnsweredQuestion } from './smartQuestion/types'
