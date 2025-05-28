
import type { CompiledDeliverable } from '../deliverableCompiler'

export interface EnhancementSuggestion {
  section: string
  suggestion: string
  priority: 'high' | 'medium' | 'low'
  impact: string
}

export interface QualityAnalysis {
  completenessScore: number
  clarityScore: number
  actionabilityScore: number
  marketReadinessScore: number
  overallScore: number
  suggestions: EnhancementSuggestion[]
}

export interface QualityScores {
  completenessScore: number
  clarityScore: number
  actionabilityScore: number
  marketReadinessScore: number
}
