import { supabase, type ProjectProposal } from '@/lib/supabase'

export interface SubmissionResult {
  success: boolean
  data?: any
  error?: string
}

export const submitProjectProposal = async (proposalData: ProjectProposal): Promise<SubmissionResult> => {
  try {
    const { data, error } = await supabase
      .from('project_proposals')
      .insert([proposalData])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return {
        success: false,
        error: error.message || 'Failed to submit proposal'
      }
    }

    return {
      success: true,
      data: data[0]
    }
  } catch (error) {
    console.error('Submission error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    }
  }
}