
import type { CompiledDeliverable } from './deliverableCompiler'
import type { QualityAnalysis } from './deliverableEnhancer'
import type { EnhancementQuestion } from './gapAnalysisService'

export interface SmartQuestion extends EnhancementQuestion {
  score: number
  reasoning: string
  dependencies: string[]
  estimatedImpact: number
  difficultyLevel: 'easy' | 'medium' | 'hard'
}

export interface QuestionPrioritizationResult {
  prioritizedQuestions: SmartQuestion[]
  nextBestQuestion: SmartQuestion | null
  completionStrategy: string
  estimatedTimeToComplete: number
}

export class SmartQuestionService {
  static async prioritizeQuestions(
    deliverable: CompiledDeliverable,
    qualityAnalysis: QualityAnalysis,
    previousAnswers: Array<{ questionId: string; answer: string; category: string }> = []
  ): Promise<QuestionPrioritizationResult> {
    console.log('Prioritizing questions for deliverable:', deliverable.projectOverview.name)

    // Generate base questions
    const baseQuestions = this.generateContextualQuestions(deliverable, qualityAnalysis)
    
    // Score and rank questions
    const scoredQuestions = this.scoreQuestions(baseQuestions, deliverable, qualityAnalysis, previousAnswers)
    
    // Apply smart prioritization logic
    const prioritizedQuestions = this.applyPrioritizationStrategy(scoredQuestions, previousAnswers)
    
    // Determine next best question
    const nextBestQuestion = this.selectNextQuestion(prioritizedQuestions, previousAnswers)
    
    // Generate completion strategy
    const completionStrategy = this.generateCompletionStrategy(prioritizedQuestions, qualityAnalysis)
    
    // Estimate time to complete
    const estimatedTime = this.estimateCompletionTime(prioritizedQuestions)

    return {
      prioritizedQuestions: prioritizedQuestions.slice(0, 15), // Limit to top 15
      nextBestQuestion,
      completionStrategy,
      estimatedTimeToComplete: estimatedTime
    }
  }

  private static generateContextualQuestions(
    deliverable: CompiledDeliverable,
    qualityAnalysis: QualityAnalysis
  ): SmartQuestion[] {
    const questions: SmartQuestion[] = []

    // High-impact technical questions
    if (qualityAnalysis.completenessScore < 80) {
      if (deliverable.technicalSpecification.components.length < 3) {
        questions.push({
          id: 'tech-core-components',
          category: 'technical',
          question: 'What are the 5 most critical technical components needed to build this solution? For each component, describe its primary function and why it\'s essential.',
          purpose: 'Define comprehensive technical architecture',
          priority: 'high',
          score: 95,
          reasoning: 'Core technical components are fundamental to implementation planning',
          dependencies: [],
          estimatedImpact: 25,
          difficultyLevel: 'medium'
        })
      }

      if (deliverable.technicalSpecification.architecture.includes('to be determined')) {
        questions.push({
          id: 'tech-architecture-decision',
          category: 'technical',
          question: 'Based on your requirements, would you prefer a microservices architecture, monolithic architecture, or serverless approach? Explain your reasoning considering scalability, team size, and maintenance needs.',
          purpose: 'Finalize technical architecture approach',
          priority: 'high',
          score: 90,
          reasoning: 'Architecture decisions impact all subsequent technical choices',
          dependencies: ['tech-core-components'],
          estimatedImpact: 20,
          difficultyLevel: 'hard'
        })
      }
    }

    // Market validation questions
    if (qualityAnalysis.marketReadinessScore < 70) {
      if (deliverable.marketAnalysis.opportunities.length === 0) {
        questions.push({
          id: 'market-opportunity-validation',
          category: 'market',
          question: 'Describe a specific real-world scenario where someone would need your solution. What problem are they facing, how are they currently solving it, and why would they switch to your solution?',
          purpose: 'Validate concrete market opportunity',
          priority: 'high',
          score: 88,
          reasoning: 'Real-world scenarios validate market need better than abstract analysis',
          dependencies: [],
          estimatedImpact: 22,
          difficultyLevel: 'medium'
        })
      }

      if (deliverable.projectOverview.targetAudience.some(audience => audience.includes('to be defined'))) {
        questions.push({
          id: 'target-user-personas',
          category: 'market',
          question: 'Describe your ideal user in detail: What\'s their job title, company size, current workflow, biggest frustration, and how tech-savvy are they? Create 2-3 specific personas.',
          purpose: 'Define precise target audience',
          priority: 'high',
          score: 85,
          reasoning: 'Clear user personas drive better product decisions',
          dependencies: [],
          estimatedImpact: 18,
          difficultyLevel: 'easy'
        })
      }
    }

    // Business model questions
    if (qualityAnalysis.actionabilityScore < 75) {
      if (deliverable.implementationPlan.resources.length === 0) {
        questions.push({
          id: 'business-resource-planning',
          category: 'business',
          question: 'What\'s your realistic budget and timeline for this project? Do you have technical team members already, or will you need to hire/outsource? What\'s your target launch date?',
          purpose: 'Establish realistic resource constraints',
          priority: 'medium',
          score: 80,
          reasoning: 'Resource constraints shape implementation approach',
          dependencies: ['tech-core-components'],
          estimatedImpact: 15,
          difficultyLevel: 'easy'
        })
      }

      if (deliverable.marketAnalysis.competitiveAdvantages.length === 0) {
        questions.push({
          id: 'business-differentiation',
          category: 'business',
          question: 'What specific features or approaches will make your solution 10x better than existing alternatives? Focus on 2-3 key differentiators that are difficult for competitors to copy.',
          purpose: 'Identify sustainable competitive advantages',
          priority: 'medium',
          score: 75,
          reasoning: 'Clear differentiation is crucial for market success',
          dependencies: ['market-opportunity-validation'],
          estimatedImpact: 16,
          difficultyLevel: 'medium'
        })
      }
    }

    // Implementation strategy questions
    if (deliverable.nextSteps.immediate.length === 0) {
      questions.push({
        id: 'impl-immediate-actions',
        category: 'implementation',
        question: 'What are the first 3 things you can start working on this week to move this project forward? Be specific about deliverables and deadlines.',
        purpose: 'Create immediate action plan',
        priority: 'high',
        score: 92,
        reasoning: 'Immediate actions create momentum and validate commitment',
        dependencies: [],
        estimatedImpact: 12,
        difficultyLevel: 'easy'
      })
    }

    // Advanced technical questions for mature projects
    if (qualityAnalysis.completenessScore > 70) {
      questions.push({
        id: 'tech-scalability-planning',
        category: 'technical',
        question: 'How will your solution handle 10x growth in users? What are the potential bottlenecks, and how would you architect for scalability from day one?',
        purpose: 'Plan for technical scalability',
        priority: 'medium',
        score: 70,
        reasoning: 'Scalability planning prevents future technical debt',
        dependencies: ['tech-architecture-decision'],
        estimatedImpact: 14,
        difficultyLevel: 'hard'
      })
    }

    return questions
  }

  private static scoreQuestions(
    questions: SmartQuestion[],
    deliverable: CompiledDeliverable,
    qualityAnalysis: QualityAnalysis,
    previousAnswers: Array<{ questionId: string; answer: string; category: string }>
  ): SmartQuestion[] {
    const answeredIds = new Set(previousAnswers.map(a => a.questionId))
    
    return questions
      .filter(q => !answeredIds.has(q.id))
      .map(question => {
        let adjustedScore = question.score

        // Boost score based on quality gaps
        if (question.category === 'technical' && qualityAnalysis.completenessScore < 60) {
          adjustedScore += 15
        }
        if (question.category === 'market' && qualityAnalysis.marketReadinessScore < 60) {
          adjustedScore += 15
        }
        if (question.category === 'implementation' && qualityAnalysis.actionabilityScore < 60) {
          adjustedScore += 10
        }

        // Reduce score for questions with unmet dependencies
        const unmetDependencies = question.dependencies.filter(dep => !answeredIds.has(dep))
        adjustedScore -= unmetDependencies.length * 10

        // Boost easy wins
        if (question.difficultyLevel === 'easy' && question.estimatedImpact > 15) {
          adjustedScore += 8
        }

        return {
          ...question,
          score: Math.max(0, adjustedScore)
        }
      })
  }

  private static applyPrioritizationStrategy(
    questions: SmartQuestion[],
    previousAnswers: Array<{ questionId: string; answer: string; category: string }>
  ): SmartQuestion[] {
    // Group questions by category
    const categoryGroups = questions.reduce((acc, q) => {
      if (!acc[q.category]) acc[q.category] = []
      acc[q.category].push(q)
      return acc
    }, {} as Record<string, SmartQuestion[]>)

    // Apply balanced prioritization - don't focus on just one category
    const answersByCategory = previousAnswers.reduce((acc, a) => {
      acc[a.category] = (acc[a.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Sort within each category and apply balancing
    Object.keys(categoryGroups).forEach(category => {
      categoryGroups[category].sort((a, b) => b.score - a.score)
      
      // Boost questions from under-represented categories
      const categoryAnswerCount = answersByCategory[category] || 0
      if (categoryAnswerCount < 2) {
        categoryGroups[category].forEach(q => q.score += 20)
      }
    })

    // Merge back and sort by adjusted score
    const allQuestions = Object.values(categoryGroups).flat()
    return allQuestions.sort((a, b) => b.score - a.score)
  }

  private static selectNextQuestion(
    prioritizedQuestions: SmartQuestion[],
    previousAnswers: Array<{ questionId: string; answer: string; category: string }>
  ): SmartQuestion | null {
    if (prioritizedQuestions.length === 0) return null

    // Find the highest-scoring question with no unmet dependencies
    const answeredIds = new Set(previousAnswers.map(a => a.questionId))
    
    for (const question of prioritizedQuestions) {
      const unmetDependencies = question.dependencies.filter(dep => !answeredIds.has(dep))
      if (unmetDependencies.length === 0) {
        return question
      }
    }

    // If all questions have dependencies, return the highest-scoring one
    return prioritizedQuestions[0]
  }

  private static generateCompletionStrategy(
    questions: SmartQuestion[],
    qualityAnalysis: QualityAnalysis
  ): string {
    const totalQuestions = questions.length
    const highPriorityQuestions = questions.filter(q => q.priority === 'high').length
    
    let strategy = `Complete ${highPriorityQuestions} high-priority questions first for maximum impact. `
    
    if (qualityAnalysis.completenessScore < 70) {
      strategy += 'Focus on technical and implementation questions to improve completeness. '
    }
    if (qualityAnalysis.marketReadinessScore < 70) {
      strategy += 'Prioritize market validation questions to strengthen business case. '
    }
    if (qualityAnalysis.actionabilityScore < 70) {
      strategy += 'Answer implementation and resource questions to improve actionability. '
    }

    strategy += `Aim to answer ${Math.min(8, totalQuestions)} questions for substantial improvement.`
    
    return strategy
  }

  private static estimateCompletionTime(questions: SmartQuestion[]): number {
    const timeEstimates = {
      easy: 3,    // 3 minutes
      medium: 7,  // 7 minutes
      hard: 12    // 12 minutes
    }

    return questions
      .slice(0, 10) // Consider top 10 questions
      .reduce((total, q) => total + timeEstimates[q.difficultyLevel], 0)
  }
}
