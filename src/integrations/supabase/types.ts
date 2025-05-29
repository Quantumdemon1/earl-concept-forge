export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      analysis_jobs: {
        Row: {
          completed_at: string | null
          concept_id: string | null
          config: Json | null
          created_at: string | null
          current_stage: string | null
          errors: Json | null
          id: string
          progress: number | null
          stages_completed: string[] | null
          started_at: string | null
          status: string | null
        }
        Insert: {
          completed_at?: string | null
          concept_id?: string | null
          config?: Json | null
          created_at?: string | null
          current_stage?: string | null
          errors?: Json | null
          id?: string
          progress?: number | null
          stages_completed?: string[] | null
          started_at?: string | null
          status?: string | null
        }
        Update: {
          completed_at?: string | null
          concept_id?: string | null
          config?: Json | null
          created_at?: string | null
          current_stage?: string | null
          errors?: Json | null
          id?: string
          progress?: number | null
          stages_completed?: string[] | null
          started_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analysis_jobs_concept_id_fkey"
            columns: ["concept_id"]
            isOneToOne: false
            referencedRelation: "concepts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_analysis_jobs_concept_id"
            columns: ["concept_id"]
            isOneToOne: false
            referencedRelation: "concepts"
            referencedColumns: ["id"]
          },
        ]
      }
      concept_analyses: {
        Row: {
          ai_assisted: boolean | null
          analysis_output: Json | null
          concept_id: string | null
          confidence_scores: Json | null
          created_at: string | null
          evaluation_output: Json | null
          id: string
          manual_overrides: Json | null
          processing_time: number | null
          refinement_output: Json | null
          reiteration_output: Json | null
          stage: string
          uncertainty_assessment: Json | null
          updated_at: string | null
          version: number
        }
        Insert: {
          ai_assisted?: boolean | null
          analysis_output?: Json | null
          concept_id?: string | null
          confidence_scores?: Json | null
          created_at?: string | null
          evaluation_output?: Json | null
          id?: string
          manual_overrides?: Json | null
          processing_time?: number | null
          refinement_output?: Json | null
          reiteration_output?: Json | null
          stage: string
          uncertainty_assessment?: Json | null
          updated_at?: string | null
          version?: number
        }
        Update: {
          ai_assisted?: boolean | null
          analysis_output?: Json | null
          concept_id?: string | null
          confidence_scores?: Json | null
          created_at?: string | null
          evaluation_output?: Json | null
          id?: string
          manual_overrides?: Json | null
          processing_time?: number | null
          refinement_output?: Json | null
          reiteration_output?: Json | null
          stage?: string
          uncertainty_assessment?: Json | null
          updated_at?: string | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "concept_analyses_concept_id_fkey"
            columns: ["concept_id"]
            isOneToOne: false
            referencedRelation: "concepts"
            referencedColumns: ["id"]
          },
        ]
      }
      concept_development_sessions: {
        Row: {
          completed_at: string | null
          completeness_score: number | null
          concept_id: string | null
          confidence_score: number | null
          config: Json | null
          created_at: string | null
          feasibility_score: number | null
          id: string
          is_active: boolean | null
          iteration_count: number | null
          llm_interactions: Json | null
          novelty_score: number | null
          stage: Database["public"]["Enums"]["development_stage"] | null
          started_at: string | null
          updated_at: string | null
        }
        Insert: {
          completed_at?: string | null
          completeness_score?: number | null
          concept_id?: string | null
          confidence_score?: number | null
          config?: Json | null
          created_at?: string | null
          feasibility_score?: number | null
          id?: string
          is_active?: boolean | null
          iteration_count?: number | null
          llm_interactions?: Json | null
          novelty_score?: number | null
          stage?: Database["public"]["Enums"]["development_stage"] | null
          started_at?: string | null
          updated_at?: string | null
        }
        Update: {
          completed_at?: string | null
          completeness_score?: number | null
          concept_id?: string | null
          confidence_score?: number | null
          config?: Json | null
          created_at?: string | null
          feasibility_score?: number | null
          id?: string
          is_active?: boolean | null
          iteration_count?: number | null
          llm_interactions?: Json | null
          novelty_score?: number | null
          stage?: Database["public"]["Enums"]["development_stage"] | null
          started_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "concept_development_sessions_concept_id_fkey"
            columns: ["concept_id"]
            isOneToOne: false
            referencedRelation: "concepts"
            referencedColumns: ["id"]
          },
        ]
      }
      concepts: {
        Row: {
          created_at: string | null
          description: string
          domains: string[] | null
          id: string
          metadata: Json | null
          name: string
          owner_id: string | null
          status: Database["public"]["Enums"]["concept_status"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          domains?: string[] | null
          id?: string
          metadata?: Json | null
          name: string
          owner_id?: string | null
          status?: Database["public"]["Enums"]["concept_status"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          domains?: string[] | null
          id?: string
          metadata?: Json | null
          name?: string
          owner_id?: string | null
          status?: Database["public"]["Enums"]["concept_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "concepts_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      development_iterations: {
        Row: {
          created_at: string | null
          extracted_components: Json | null
          extracted_refinements: Json | null
          extracted_research: Json | null
          extracted_validations: Json | null
          id: string
          iteration_number: number
          llm_response: Json
          prompt_filled: string
          prompt_template: string
          quality_scores: Json | null
          session_id: string | null
          stage: Database["public"]["Enums"]["development_stage"]
        }
        Insert: {
          created_at?: string | null
          extracted_components?: Json | null
          extracted_refinements?: Json | null
          extracted_research?: Json | null
          extracted_validations?: Json | null
          id?: string
          iteration_number: number
          llm_response: Json
          prompt_filled: string
          prompt_template: string
          quality_scores?: Json | null
          session_id?: string | null
          stage: Database["public"]["Enums"]["development_stage"]
        }
        Update: {
          created_at?: string | null
          extracted_components?: Json | null
          extracted_refinements?: Json | null
          extracted_research?: Json | null
          extracted_validations?: Json | null
          id?: string
          iteration_number?: number
          llm_response?: Json
          prompt_filled?: string
          prompt_template?: string
          quality_scores?: Json | null
          session_id?: string | null
          stage?: Database["public"]["Enums"]["development_stage"]
        }
        Relationships: [
          {
            foreignKeyName: "development_iterations_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "concept_development_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      enhancement_iterations: {
        Row: {
          concept_id: string
          created_at: string
          enhanced_deliverable: Json
          enhanced_sections: string[]
          id: string
          original_deliverable: Json
          quality_improvement: Json
          question_answers: Json
          updated_at: string
        }
        Insert: {
          concept_id: string
          created_at?: string
          enhanced_deliverable: Json
          enhanced_sections?: string[]
          id?: string
          original_deliverable: Json
          quality_improvement?: Json
          question_answers?: Json
          updated_at?: string
        }
        Update: {
          concept_id?: string
          created_at?: string
          enhanced_deliverable?: Json
          enhanced_sections?: string[]
          id?: string
          original_deliverable?: Json
          quality_improvement?: Json
          question_answers?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "enhancement_iterations_concept_id_fkey"
            columns: ["concept_id"]
            isOneToOne: false
            referencedRelation: "concepts"
            referencedColumns: ["id"]
          },
        ]
      }
      external_research_cache: {
        Row: {
          concept_id: string | null
          created_at: string | null
          expires_at: string
          id: string
          query: string
          results: Json
          source: string
        }
        Insert: {
          concept_id?: string | null
          created_at?: string | null
          expires_at: string
          id?: string
          query: string
          results: Json
          source: string
        }
        Update: {
          concept_id?: string | null
          created_at?: string | null
          expires_at?: string
          id?: string
          query?: string
          results?: Json
          source?: string
        }
        Relationships: [
          {
            foreignKeyName: "external_research_cache_concept_id_fkey"
            columns: ["concept_id"]
            isOneToOne: false
            referencedRelation: "concepts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      visualizations: {
        Row: {
          analysis_id: string | null
          concept_id: string | null
          created_at: string | null
          data: Json
          id: string
          metadata: Json | null
          stage: string
          type: string
        }
        Insert: {
          analysis_id?: string | null
          concept_id?: string | null
          created_at?: string | null
          data: Json
          id?: string
          metadata?: Json | null
          stage: string
          type: string
        }
        Update: {
          analysis_id?: string | null
          concept_id?: string | null
          created_at?: string | null
          data?: Json
          id?: string
          metadata?: Json | null
          stage?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "visualizations_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "concept_analyses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visualizations_concept_id_fkey"
            columns: ["concept_id"]
            isOneToOne: false
            referencedRelation: "concepts"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      user_owns_concept: {
        Args: { concept_uuid: string }
        Returns: boolean
      }
    }
    Enums: {
      concept_status:
        | "draft"
        | "evaluating"
        | "analyzing"
        | "refining"
        | "reiterating"
        | "completed"
      confidence_rating: "high" | "moderate" | "low"
      development_stage:
        | "initial"
        | "expanding"
        | "researching"
        | "validating"
        | "refining"
        | "implementing"
        | "complete"
      uncertainty_level: "low" | "moderate" | "high"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      concept_status: [
        "draft",
        "evaluating",
        "analyzing",
        "refining",
        "reiterating",
        "completed",
      ],
      confidence_rating: ["high", "moderate", "low"],
      development_stage: [
        "initial",
        "expanding",
        "researching",
        "validating",
        "refining",
        "implementing",
        "complete",
      ],
      uncertainty_level: ["low", "moderate", "high"],
    },
  },
} as const
