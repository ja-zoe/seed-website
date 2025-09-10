// Export Supabase database types
export type { Database } from '../lib/supabase';
export type ProjectProposal = Database['public']['Tables']['project_proposals']['Row'];
export type NewProjectProposal = Database['public']['Tables']['project_proposals']['Insert'];