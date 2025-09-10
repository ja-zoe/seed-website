-- Supabase Database Migration Script
-- Run this in your Supabase SQL Editor

-- Create the project_proposals table
CREATE TABLE IF NOT EXISTS project_proposals (
  id BIGSERIAL PRIMARY KEY,
  submitted_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  leads JSONB NOT NULL,
  problem_statement JSONB NOT NULL,
  goal JSONB NOT NULL,
  objectives JSONB NOT NULL,
  team_roles JSONB,
  seed_activity JSONB,
  timeline JSONB NOT NULL,
  expected_expenses JSONB NOT NULL,
  expected_outcomes JSONB NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE project_proposals ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can insert proposals" ON project_proposals;
DROP POLICY IF EXISTS "Authenticated users can view proposals" ON project_proposals;  
DROP POLICY IF EXISTS "Authenticated users can delete proposals" ON project_proposals;

-- Create policies for public read access (for form submissions)
-- Anyone can insert proposals (public form submissions)
CREATE POLICY "Anyone can insert proposals" ON project_proposals
  FOR INSERT TO public
  WITH CHECK (true);

-- Only authenticated users can view proposals (admin dashboard)
CREATE POLICY "Authenticated users can view proposals" ON project_proposals
  FOR SELECT TO authenticated
  USING (true);

-- Only authenticated users can delete proposals (admin dashboard)
CREATE POLICY "Authenticated users can delete proposals" ON project_proposals
  FOR DELETE TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_project_proposals_submitted_at ON project_proposals(submitted_at);
CREATE INDEX IF NOT EXISTS idx_project_proposals_leads ON project_proposals USING GIN (leads);
CREATE INDEX IF NOT EXISTS idx_project_proposals_problem_statement ON project_proposals USING GIN (problem_statement);
CREATE INDEX IF NOT EXISTS idx_project_proposals_objectives ON project_proposals USING GIN (objectives);

-- Add a comment to the table
COMMENT ON TABLE project_proposals IS 'Stores SEED project proposal form submissions';

-- Verify the table was created correctly
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'project_proposals' 
ORDER BY ordinal_position;