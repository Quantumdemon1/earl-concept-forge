
import type { CompiledDeliverable } from './deliverableCompiler'
import type { QualityAnalysis } from './deliverableEnhancer'

export interface SmartQuestionResult {
  prioritizedQuestions: any[]
  nextBestQuestion: any | null
  completionStrategy: string
  estimatedTimeToComplete: number
  totalQuestions: number
}

export class SmartQuestionService {
  static async prioritizeQuestions(
    deliverable: CompiledDeliverable,
    qualityAnalysis: QualityAnalysis,
    answeredQuestions: Array<{ questionId: string; answer: string; category: string }>
  ): Promise<SmartQuestionResult> {
    console.log('Prioritizing smart questions:', { deliverable, qualityAnalysis, answeredQuestions })

    // Generate questions based on quality gaps
    const questions = this.generateQuestionsFromGaps(deliverable, qualityAnalysis)
    
    // Filter out already answered questions
    const answeredIds = new Set(answeredQuestions.map(q => q.questionId))
    const unansweredQuestions = questions.filter(q => !answeredIds.has(q.id))

    // Prioritize questions based on impact and current gaps
    const prioritizedQuestions = this.prioritizeByImpact(unansweredQuestions, qualityAnalysis)

    // Determine next best question
    const nextBestQuestion = prioritizedQuestions.length > 0 ? prioritizedQuestions[0] : null

    // Generate completion strategy
    const completionStrategy = this.generateCompletionStrategy(qualityAnalysis, answeredQuestions.length)

    // Estimate time to complete
    const estimatedTimeToComplete = this.estimateCompletionTime(prioritizedQuestions.length, qualityAnalysis)

    return {
      prioritizedQuestions,
      nextBestQuestion,
      completionStrategy,
      estimatedTimeToComplete,
      totalQuestions: questions.length
    }
  }

  private static generateQuestionsFromGaps(deliverable: CompiledDeliverable, analysis: QualityAnalysis): any[] {
    const questions: any[] = []

    // Technical gaps
    if (deliverable.technicalSpecification.components.length < 5) {
      questions.push({
        id: 'tech-components-detail',
        category: 'technical',
        question: 'What specific technical components and their interactions are needed to build this solution?',
        purpose: 'Define comprehensive technical architecture',
        priority: 'high',
        impact: 15
      })
    }

    if (deliverable.technicalSpecification.architecture.includes('to be determined')) {
      questions.push({
        id: 'tech-architecture-choice',
        category: 'technical',
        question: 'What architectural patterns and technology stack would best serve this solution?',
        purpose: 'Establish technical foundation',
        priority: 'high',
        impact: 20
      })
    }

    // Market gaps
    if (analysis.marketReadinessScore < 70) {
      questions.push({
        id: 'market-validation',
        category: 'market',
        question: 'What evidence validates that there is real demand for this solution in the target market?',
        purpose: 'Validate market opportunity',
        priority: 'high',
        impact: 18
      })
    }

    if (deliverable.projectOverview.targetAudience.some(audience => audience.includes('to be defined'))) {
      questions.push({
        id: 'target-persona',
        category: 'market',
        question: 'Who are the specific user personas, and what are their detailed needs and pain points?',
        purpose: 'Define target market segments',
        priority: 'medium',
        impact: 12
      })
    }

    // Business gaps
    if (deliverable.implementationPlan.resources.length < 3) {
      questions.push({
        id: 'resource-planning',
        category: 'business',
        question: 'What specific resources, budget, and timeline are needed for successful implementation?',
        purpose: 'Create realistic implementation plan',
        priority: 'medium',
        impact: 10
      })
    }

    if (deliverable.marketAnalysis.competitiveAdvantages.length === 0) {
      questions.push({
        id: 'competitive-advantage',
        category: 'business',
        question: 'What unique value proposition differentiates this solution from existing alternatives?',
        purpose: 'Establish competitive positioning',
        priority: 'medium',
        impact: 14
      })
    }

    // Implementation gaps
    if (analysis.actionabilityScore < 70) {
      questions.push({
        id: 'implementation-roadmap',
        category: 'implementation',
        question: 'What are the specific milestones, deliverables, and success criteria for each development phase?',
        purpose: 'Create actionable implementation roadmap',
        priority: 'high',
        impact: 16
      })
    }

    if (deliverable.validationResults.riskAssessment.length < 3) {
      questions.push({
        id: 'risk-mitigation',
        category: 'implementation',
        question: 'What are the key risks and specific mitigation strategies for this project?',
        purpose: 'Prepare for potential challenges',
        priority: 'medium',
        impact: 8
      })
    }

    return questions
  }

  private static prioritizeByImpact(questions: any[], analysis: QualityAnalysis): any[] {
    return questions.sort((a, b) => {
      // First sort by priority
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
      
      if (priorityDiff !== 0) return priorityDiff
      
      // Then by impact score
      return b.impact - a.impact
    })
  }

  private static generateCompletionStrategy(analysis: QualityAnalysis, answeredCount: number): string {
    if (analysis.overallScore >= 85) {
      return 'Focus on final refinements and validation before export'
    }
    
    if (analysis.overallScore >= 70) {
      return 'Address remaining gaps in weak areas to achieve export readiness'
    }
    
    if (answeredCount < 3) {
      return 'Answer foundational questions to establish core project elements'
    }
    
    if (analysis.completenessScore < 60) {
      return 'Focus on completing missing project components and specifications'
    }
    
    if (analysis.actionabilityScore < 60) {
      return 'Develop specific implementation plans and actionable next steps'
    }
    
    return 'Systematically address quality gaps through targeted enhancements'
  }

  private static estimateCompletionTime(questionsRemaining: number, analysis: QualityAnalysis): number {
    // Base time per question (in minutes)
    const baseTimePerQuestion = 3
    
    // Adjust based on complexity
    let complexityMultiplier = 1
    if (analysis.overallScore < 50) complexityMultiplier = 1.5
    else if (analysis.overallScore < 70) complexityMultiplier = 1.2
    
    // Factor in diminishing returns for later questions
    const adjustedQuestions = questionsRemaining <= 5 
      ? questionsRemaining 
      : 5 + (questionsRemaining - 5) * 0.7
    
    return Math.round(adjustedQuestions * baseTimePerQuestion * complexityMultiplier)
  }
}
