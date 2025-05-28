
import type { CompiledDeliverable } from '../deliverableCompiler'
import type { QualityAnalysis } from '../deliverableEnhancer'

export interface GapAnalysisResult {
  missingComponents: string[]
  weakSections: string[]
  enhancementPrompts: string[]
  qualityAnalysis: QualityAnalysis
  recommendedActions: string[]
}

export interface EnhancementQuestion {
  id: string
  category: 'technical' | 'market' | 'business' | 'implementation'
  question: string
  purpose: string
  priority: 'high' | 'medium' | 'low'
}

export type { QualityAnalysis } from '../deliverableEnhancer'
