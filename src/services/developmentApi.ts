
import { supabase } from '@/lib/supabase'
import type { DevelopmentSession, DevelopmentConfig } from '@/types/development'

export class DevelopmentApiService {
  static async startSession(conceptId: string, config?: DevelopmentConfig): Promise<{ sessionId: string; stage?: string; iteration?: number; scores?: any }> {
    const { data, error } = await supabase.functions.invoke('develop-concept', {
      body: { conceptId, config },
    })
    
    if (error) throw error
    return data
  }
  
  static async runIteration(conceptId: string, sessionId: string): Promise<{ stage?: string; iteration?: number; scores?: any }> {
    const { data, error } = await supabase.functions.invoke('develop-concept', {
      body: { 
        conceptId,
        sessionId,
        action: 'iterate'
      },
    })
    
    if (error) throw error
    return data
  }
  
  static async loadSessionFromDb(sessionId: string): Promise<DevelopmentSession> {
    const { data, error } = await supabase
      .from('concept_development_sessions')
      .select('*')
      .eq('id', sessionId)
      .single()
    
    if (error) throw error
    
    return {
      id: data.id,
      conceptId: data.concept_id,
      stage: data.stage,
      iteration: data.iteration_count,
      scores: {
        completeness: data.completeness_score || 0,
        confidence: data.confidence_score || 0,
        feasibility: data.feasibility_score || 0,
        novelty: data.novelty_score || 0,
      },
      isActive: data.is_active,
      history: Array.isArray(data.llm_interactions) ? data.llm_interactions : [],
      startedAt: data.started_at,
      completedAt: data.completed_at,
    }
  }
}
