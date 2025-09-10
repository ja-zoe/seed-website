# Supabase Setup Guide for SEED Project Proposal Form

This application has been updated to use Supabase as the backend database and authentication provider instead of direct PostgreSQL access from the browser.

## Prerequisites

1. A Supabase account (free at [supabase.com](https://supabase.com))
2. A new or existing Supabase project

## Step 1: Create/Configure Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project or select an existing one
3. Wait for the project to be fully initialized

## Step 2: Set Up Database Tables

Go to the SQL Editor in your Supabase dashboard and run this SQL script:

```sql
-- Create the project_proposals table
CREATE TABLE project_proposals (
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
CREATE INDEX idx_project_proposals_submitted_at ON project_proposals(submitted_at);
CREATE INDEX idx_project_proposals_leads ON project_proposals USING GIN (leads);
CREATE INDEX idx_project_proposals_problem_statement ON project_proposals USING GIN (problem_statement);
CREATE INDEX idx_project_proposals_objectives ON project_proposals USING GIN (objectives);
```

## Step 3: Set Up Authentication (Optional)

If you want to use admin authentication:

1. Go to Authentication > Settings in your Supabase dashboard
2. Configure your authentication settings as needed
3. Create admin users through the Supabase dashboard or via email signup

## Step 4: Get Your Project Credentials

1. Go to Settings > API in your Supabase dashboard
2. Copy the following values:
   - Project URL (something like `https://your-project-id.supabase.co`)
   - Project API Key (anon public key)

## Step 5: Configure Environment Variables

1. Create a `.env` file in your project root (copy from `.env.example`)
2. Add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 6: Test the Application

1. Start the development server: `npm run dev`
2. Test form submissions on the main page
3. Test admin login and dashboard access at `/admin`

## Features

### Public Form
- ✅ Form submissions work without authentication
- ✅ Data is saved to Supabase tables
- ✅ Form validation and auto-save drafts

### Admin Dashboard  
- ✅ Supabase authentication required
- ✅ View all submitted proposals
- ✅ Search and filter proposals
- ✅ Export proposals to Excel
- ✅ View detailed proposal information

## Troubleshooting

### Common Issues:

1. **Environment variables not loading**: Make sure your `.env` file is in the project root and variables start with `VITE_`

2. **Authentication not working**: Check that you've created admin users in the Supabase dashboard

3. **RLS policies blocking access**: Make sure the SQL policies were created correctly

4. **CORS errors**: Supabase should handle CORS automatically, but check your project URL is correct

### Admin Access

For admin authentication, users need to:
1. Have an account in your Supabase project
2. Have an email ending with `@rutgers.edu` or containing `admin`

You can modify the admin check logic in `src/services/supabaseAuthService.ts`.

## Migration from Direct PostgreSQL

This application previously used direct PostgreSQL access which doesn't work in the browser. The migration to Supabase provides:

- ✅ Secure database access from the browser
- ✅ Built-in authentication and authorization  
- ✅ Row Level Security for data protection
- ✅ Real-time capabilities (if needed in future)
- ✅ Automatic API generation
- ✅ Better scalability and performance

All data structures remain the same, so existing data can be migrated if needed.