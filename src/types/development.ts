
export interface DevelopmentSession {
  id: string
  conceptId: string
  stage: string
  iteration: number
  scores: {
    completeness: number
    confidence: number
    feasibility: number
    novelty: number
  }
  isActive: boolean
  history: any[]
  startedAt?: string
  completedAt?: string
}

export interface DevelopmentConfig {
  maxIterations?: number
  autoRun?: boolean
  qualityThresholds?: {
    completeness: number
    confidence: number
    feasibility: number
  }
}
