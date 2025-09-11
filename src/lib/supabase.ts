import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for the project_proposals table
export interface ProjectProposal {
  id?: string
  created_at?: string
  leads: Array<{
    name: string
    email: string
    phone: string
  }>
  objectives: string[]
  team_roles?: Array<{
    role: string
    responsibilities: string
    teamMember: string
  }>
  timeline: Array<{
    task: string
    deliverable: string
    startDate: string
    endDate: string
    responsibleParty?: string
  }>
  expected_expenses: Array<{
    item: string
    purpose: string
    cost: string
    link?: string
  }>
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
  seed_activity?: {
    what: string
    whenWhere: string
    why: string
  }
  expected_outcomes: {
    accomplishments: string
    finalDeliverable: string
    contributionToSEED: string
  }
}