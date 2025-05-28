
import { supabase } from '@/integrations/supabase/client'

export const projectService = {
  async getConceptById(conceptId: string) {
    const { data: concept, error } = await supabase
      .from('concepts')
      .select('*')
      .eq('id', conceptId)
      .single()

    if (error) {
      throw error
    }

    // Also fetch related development sessions and analyses
    const { data: developmentSessions } = await supabase
      .from('concept_development_sessions')
      .select('*')
      .eq('concept_id', conceptId)

    const { data: analyses } = await supabase
      .from('concept_analyses')
      .select('*')
      .eq('concept_id', conceptId)

    return {
      concept,
      developmentSessions: developmentSessions || [],
      analyses: analyses || [],
    }
  }
}
