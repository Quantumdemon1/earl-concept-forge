
import type { CompiledDeliverable } from '../deliverableCompiler'
import type { QualityAnalysis } from '../deliverableEnhancer/types'
import type { SmartQuestion } from './types'

export class QuestionGenerator {
  static generateQuestionsFromGaps(deliverable: CompiledDeliverable, analysis: QualityAnalysis): SmartQuestion[] {
    const questions: SmartQuestion[] = []

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
}
