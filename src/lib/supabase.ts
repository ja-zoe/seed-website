import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for TypeScript
export interface Database {
  public: {
    Tables: {
      project_proposals: {
        Row: {
          id: number
          submitted_at: string
          leads: any[]
          problem_statement: {
            environmentalIssue: string
            whyItMatters: string
            pastAttempts: string
            evidenceAndLessons: string
          }
          goal: {
            overarchingAim: string
            howItAddressesProblem: string
            approach: string
            expectedLearning: string
          }
          objectives: string[]
          team_roles?: any[]
          seed_activity?: {
            what: string
            whenWhere: string
            why: string
          }
          timeline: any[]
          expected_expenses: any[]
          expected_outcomes: {
            accomplishments: string
            finalDeliverable: string
            contributionToSEED: string
          }
        }
        Insert: {
          id?: number
          submitted_at?: string
          leads: any[]
          problem_statement: {
            environmentalIssue: string
            whyItMatters: string
            pastAttempts: string
            evidenceAndLessons: string
          }
          goal: {
            overarchingAim: string
            howItAddressesProblem: string
            approach: string
            expectedLearning: string
          }
          objectives: string[]
          team_roles?: any[]
          seed_activity?: {
            what: string
            whenWhere: string
            why: string
          }
          timeline: any[]
          expected_expenses: any[]
          expected_outcomes: {
            accomplishments: string
            finalDeliverable: string
            contributionToSEED: string
          }
        }
        Update: {
          id?: number
          submitted_at?: string
          leads?: any[]
          problem_statement?: {
            environmentalIssue: string
            whyItMatters: string
            pastAttempts: string
            evidenceAndLessons: string
          }
          goal?: {
            overarchingAim: string
            howItAddressesProblem: string
            approach: string
            expectedLearning: string
          }
          objectives?: string[]
          team_roles?: any[]
          seed_activity?: {
            what: string
            whenWhere: string
            why: string
          }
          timeline?: any[]
          expected_expenses?: any[]
          expected_outcomes?: {
            accomplishments: string
            finalDeliverable: string
            contributionToSEED: string
          }
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}