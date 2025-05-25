
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestBody {
  conceptId: string
  sessionId?: string
  action?: 'iterate'
  config?: {
    maxIterations?: number
    autoRun?: boolean
    qualityThresholds?: {
      completeness: number
      confidence: number
      feasibility: number
    }
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (authHeader) {
      supabase.auth.setSession({
        access_token: authHeader.replace('Bearer ', ''),
        refresh_token: ''
      })
    }

    const { conceptId, sessionId, action, config }: RequestBody = await req.json()

    console.log('Processing request:', { conceptId, sessionId, action })

    if (action === 'iterate' && sessionId) {
      // Handle iteration request
      const { data: session, error: sessionError } = await supabase
        .from('concept_development_sessions')
        .select('*')
        .eq('id', sessionId)
        .single()

      if (sessionError) {
        throw new Error(`Session not found: ${sessionError.message}`)
      }

      // Simulate development iteration with mock data
      const newIteration = (session.iteration_count || 0) + 1
      const mockScores = {
        completeness: Math.min(0.95, (session.completeness_score || 0) + Math.random() * 0.1),
        confidence: Math.min(0.95, (session.confidence_score || 0) + Math.random() * 0.1),
        feasibility: Math.min(0.95, (session.feasibility_score || 0) + Math.random() * 0.1),
        novelty: Math.min(0.95, (session.novelty_score || 0) + Math.random() * 0.05),
      }

      const stages = ['initial', 'expanding', 'researching', 'validating', 'refining', 'implementing', 'complete']
      const currentStageIndex = stages.indexOf(session.stage || 'initial')
      const newStage = newIteration > 15 ? 'complete' : stages[Math.min(currentStageIndex + Math.floor(newIteration / 3), stages.length - 1)]

      // Update session in database
      const { error: updateError } = await supabase
        .from('concept_development_sessions')
        .update({
          iteration_count: newIteration,
          stage: newStage,
          completeness_score: mockScores.completeness,
          confidence_score: mockScores.confidence,
          feasibility_score: mockScores.feasibility,
          novelty_score: mockScores.novelty,
          llm_interactions: [...(session.llm_interactions || []), {
            iteration: newIteration,
            stage: newStage,
            timestamp: new Date().toISOString(),
            scores: mockScores
          }],
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId)

      if (updateError) {
        throw new Error(`Failed to update session: ${updateError.message}`)
      }

      return new Response(
        JSON.stringify({
          stage: newStage,
          iteration: newIteration,
          scores: mockScores
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    } else {
      // Handle session creation
      const sessionId = crypto.randomUUID()
      const initialScores = {
        completeness: 0.1 + Math.random() * 0.1,
        confidence: 0.1 + Math.random() * 0.1,
        feasibility: 0.1 + Math.random() * 0.1,
        novelty: 0.1 + Math.random() * 0.1,
      }

      // Create new session in database
      const { error: insertError } = await supabase
        .from('concept_development_sessions')
        .insert({
          id: sessionId,
          concept_id: conceptId,
          stage: 'initial',
          iteration_count: 0,
          completeness_score: initialScores.completeness,
          confidence_score: initialScores.confidence,
          feasibility_score: initialScores.feasibility,
          novelty_score: initialScores.novelty,
          config: config || {},
          llm_interactions: [],
          is_active: true,
          started_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (insertError) {
        throw new Error(`Failed to create session: ${insertError.message}`)
      }

      console.log('Created new session:', sessionId)

      return new Response(
        JSON.stringify({
          sessionId,
          stage: 'initial',
          iteration: 0,
          scores: initialScores
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }
  } catch (error) {
    console.error('Edge function error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
