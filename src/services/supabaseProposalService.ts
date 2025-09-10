import { supabase } from '@/lib/supabase';
import type { z } from 'zod';
import { projectProposalFormSchema } from '@/schemas/ProjectProposalSchema';

export type ProjectProposalFormData = z.infer<typeof projectProposalFormSchema>;

export interface ProjectProposal {
  id: number;
  submitted_at: string;
  leads: any[];
  problem_statement: {
    environmentalIssue: string;
    whyItMatters: string;
    pastAttempts: string;
    evidenceAndLessons: string;
  };
  goal: {
    overarchingAim: string;
    howItAddressesProblem: string;
    approach: string;
    expectedLearning: string;
  };
  objectives: string[];
  team_roles?: any[];
  seed_activity?: {
    what: string;
    whenWhere: string;
    why: string;
  };
  timeline: any[];
  expected_expenses: any[];
  expected_outcomes: {
    accomplishments: string;
    finalDeliverable: string;
    contributionToSEED: string;
  };
}

export class SupabaseProposalService {
  /**
   * Create a new project proposal
   */
  static async createProposal(proposalData: ProjectProposalFormData): Promise<ProjectProposal> {
    // Transform the form data to match the database schema
    const dbData = {
      leads: proposalData.leads,
      problem_statement: proposalData.problemStatement,
      goal: proposalData.goal,
      objectives: proposalData.objectives,
      team_roles: proposalData.teamRoles || null,
      seed_activity: proposalData.seedActivity || null,
      timeline: proposalData.timeline,
      expected_expenses: proposalData.expectedExpenses,
      expected_outcomes: proposalData.expectedOutcomes,
    };

    const { data, error } = await supabase
      .from('project_proposals')
      .insert([dbData])
      .select()
      .single();

    if (error) {
      console.error('Error creating proposal:', error);
      throw new Error(`Failed to create proposal: ${error.message}`);
    }

    return data;
  }

  /**
   * Get all project proposals with optional search
   */
  static async getProposals(searchTerm?: string): Promise<ProjectProposal[]> {
    let query = supabase
      .from('project_proposals')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (searchTerm) {
      // Search in leads' names and emails, problem statement, and objectives
      // Using OR conditions for text search
      query = query.or(`leads.cs.{"name":"${searchTerm}"},problem_statement->>environmentalIssue.ilike.%${searchTerm}%,objectives.cs.{${searchTerm}},goal->>overarchingAim.ilike.%${searchTerm}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching proposals:', error);
      throw new Error(`Failed to fetch proposals: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Get a single proposal by ID
   */
  static async getProposalById(id: number): Promise<ProjectProposal | null> {
    const { data, error } = await supabase
      .from('project_proposals')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      console.error('Error fetching proposal:', error);
      throw new Error(`Failed to fetch proposal: ${error.message}`);
    }

    return data;
  }

  /**
   * Delete a proposal by ID
   */
  static async deleteProposal(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('project_proposals')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting proposal:', error);
      throw new Error(`Failed to delete proposal: ${error.message}`);
    }

    return true;
  }

  /**
   * Get proposal statistics
   */
  static async getStatistics() {
    // Get total count
    const { count: totalCount, error: totalError } = await supabase
      .from('project_proposals')
      .select('*', { count: 'exact', head: true });

    if (totalError) {
      console.error('Error fetching total count:', totalError);
      throw new Error(`Failed to fetch statistics: ${totalError.message}`);
    }

    // Get recent count (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { count: recentCount, error: recentError } = await supabase
      .from('project_proposals')
      .select('*', { count: 'exact', head: true })
      .gte('submitted_at', thirtyDaysAgo.toISOString());

    if (recentError) {
      console.error('Error fetching recent count:', recentError);
      throw new Error(`Failed to fetch recent statistics: ${recentError.message}`);
    }

    return {
      total: totalCount || 0,
      recent: recentCount || 0,
    };
  }
}