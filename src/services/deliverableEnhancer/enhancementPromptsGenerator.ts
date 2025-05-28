
import type { CompiledDeliverable } from '../deliverableCompiler'
import type { QualityAnalysis } from './types'

export class EnhancementPromptsGenerator {
  static generateEnhancementPrompts(deliverable: CompiledDeliverable, analysis: QualityAnalysis): string[] {
    const prompts: string[] = []

    // Based on low scores, generate specific prompts
    if (analysis.completenessScore < 70) {
      prompts.push('Add more detailed technical specifications and implementation details')
    }

    if (analysis.clarityScore < 70) {
      prompts.push('Improve clarity of problem statement and solution description')
    }

    if (analysis.actionabilityScore < 70) {
      prompts.push('Provide more specific and actionable implementation steps')
    }

    if (analysis.marketReadinessScore < 70) {
      prompts.push('Enhance market analysis and business case validation')
    }

    // Component-specific prompts
    if (deliverable.technicalSpecification.components.length < 3) {
      prompts.push('Define more technical components and their relationships')
    }

    if (deliverable.implementationPlan.phases.length < 2) {
      prompts.push('Create a more detailed phased implementation plan')
    }

    if (deliverable.validationResults.recommendations.length < 3) {
      prompts.push('Provide more actionable recommendations based on analysis')
    }

    return prompts.slice(0, 5) // Limit to top 5 prompts
  }
}
