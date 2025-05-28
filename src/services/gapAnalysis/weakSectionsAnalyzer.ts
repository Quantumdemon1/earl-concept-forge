
import type { CompiledDeliverable } from '../deliverableCompiler'
import type { QualityAnalysis } from '../deliverableEnhancer'

export class WeakSectionsAnalyzer {
  static identifyWeakSections(deliverable: CompiledDeliverable, analysis: QualityAnalysis): string[] {
    const weak: string[] = []

    if (analysis.completenessScore < 70) {
      weak.push('Overall project completeness needs improvement')
    }

    if (analysis.actionabilityScore < 60) {
      weak.push('Implementation plan lacks actionable details')
    }

    if (analysis.clarityScore < 70) {
      weak.push('Project description and goals need clarification')
    }

    if (analysis.marketReadinessScore < 60) {
      weak.push('Market validation and business case need strengthening')
    }

    // Check specific sections
    if (deliverable.projectOverview.problemStatement.length < 50) {
      weak.push('Problem statement is too brief or vague')
    }

    if (deliverable.technicalSpecification.components.filter(c => c.priority === 'high').length === 0) {
      weak.push('No high-priority technical components identified')
    }

    if (deliverable.implementationPlan.phases.length < 2) {
      weak.push('Implementation plan lacks sufficient detail')
    }

    return weak
  }
}
