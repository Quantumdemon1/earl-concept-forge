
import type { CompiledDeliverable } from '../deliverableCompiler'
import type { EnhancementQuestion } from './types'

export class EnhancementQuestionsGenerator {
  static generateEnhancementQuestions(deliverable: CompiledDeliverable): EnhancementQuestion[] {
    const questions: EnhancementQuestion[] = []

    // Technical questions
    if (deliverable.technicalSpecification.components.length < 3) {
      questions.push({
        id: 'tech-components',
        category: 'technical',
        question: 'What are the core technical components needed to build this solution? Please list at least 5 specific modules, services, or features.',
        purpose: 'Identify comprehensive technical requirements',
        priority: 'high'
      })
    }

    if (deliverable.technicalSpecification.architecture.includes('to be determined')) {
      questions.push({
        id: 'tech-architecture',
        category: 'technical',
        question: 'What technical architecture would you recommend for this solution? Consider scalability, performance, and maintenance requirements.',
        purpose: 'Define system architecture',
        priority: 'high'
      })
    }

    // Market questions
    if (deliverable.marketAnalysis.opportunities.length === 0) {
      questions.push({
        id: 'market-opportunity',
        category: 'market',
        question: 'What specific market opportunities does this solution address? Who are the potential customers and what problems do they currently face?',
        purpose: 'Validate market opportunity',
        priority: 'high'
      })
    }

    if (deliverable.projectOverview.targetAudience.some(audience => audience.includes('to be defined'))) {
      questions.push({
        id: 'target-users',
        category: 'market',
        question: 'Who exactly would use this solution? Please describe 2-3 specific user personas with their needs, behaviors, and pain points.',
        purpose: 'Define target audience',
        priority: 'high'
      })
    }

    // Business questions
    if (deliverable.implementationPlan.resources.length === 0) {
      questions.push({
        id: 'business-resources',
        category: 'business',
        question: 'What resources (team size, skills, budget, timeline) would be needed to build and launch this solution?',
        purpose: 'Estimate resource requirements',
        priority: 'medium'
      })
    }

    if (deliverable.marketAnalysis.competitiveAdvantages.length === 0) {
      questions.push({
        id: 'business-advantage',
        category: 'business',
        question: 'What makes this solution unique compared to existing alternatives? What competitive advantages does it have?',
        purpose: 'Identify differentiation',
        priority: 'medium'
      })
    }

    // Implementation questions
    if (deliverable.nextSteps.immediate.length === 0) {
      questions.push({
        id: 'impl-next-steps',
        category: 'implementation',
        question: 'What are the first 5 concrete actions that should be taken to move this project forward in the next 30 days?',
        purpose: 'Define immediate action plan',
        priority: 'high'
      })
    }

    if (deliverable.validationResults.riskAssessment.length === 0) {
      questions.push({
        id: 'impl-risks',
        category: 'implementation',
        question: 'What are the main risks and challenges for this project? How could they be mitigated?',
        purpose: 'Assess and plan for risks',
        priority: 'medium'
      })
    }

    return questions.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
  }
}
