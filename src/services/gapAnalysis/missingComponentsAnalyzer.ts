
import type { CompiledDeliverable } from '../deliverableCompiler'

export class MissingComponentsAnalyzer {
  static identifyMissingComponents(deliverable: CompiledDeliverable): string[] {
    const missing: string[] = []

    // Technical components
    if (deliverable.technicalSpecification.components.length === 0) {
      missing.push('Core technical components and features')
    }

    if (deliverable.technicalSpecification.technicalRequirements.length === 0) {
      missing.push('Technical requirements and constraints')
    }

    if (deliverable.technicalSpecification.integrations.length === 0) {
      missing.push('External system integrations')
    }

    // Market components
    if (deliverable.marketAnalysis.opportunities.length === 0) {
      missing.push('Market opportunity analysis')
    }

    if (deliverable.marketAnalysis.competitiveAdvantages.length === 0) {
      missing.push('Competitive advantage definition')
    }

    // Business components
    if (deliverable.implementationPlan.resources.length === 0) {
      missing.push('Resource requirements planning')
    }

    if (deliverable.implementationPlan.milestones.length === 0) {
      missing.push('Project milestones and timeline')
    }

    // Validation components
    if (deliverable.validationResults.riskAssessment.length === 0) {
      missing.push('Risk assessment and mitigation')
    }

    if (deliverable.validationResults.recommendations.length === 0) {
      missing.push('Actionable recommendations')
    }

    return missing
  }
}
