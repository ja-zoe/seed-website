import { pgTable, serial, text, timestamp, json } from 'drizzle-orm/pg-core';

export const projectProposals = pgTable('project_proposals', {
  id: serial('id').primaryKey(),
  
  // Form metadata
  submittedAt: timestamp('submitted_at').defaultNow().notNull(),
  
  // Project leads (array of objects)
  leads: json('leads').notNull(),
  
  // Problem statement (object)
  problemStatement: json('problem_statement').notNull(),
  
  // Goal (object)  
  goal: json('goal').notNull(),
  
  // Objectives (array of strings)
  objectives: json('objectives').notNull(),
  
  // Team roles (array of objects, optional)
  teamRoles: json('team_roles'),
  
  // SEED activity (object, optional)
  seedActivity: json('seed_activity'),
  
  // Timeline (array of objects)
  timeline: json('timeline').notNull(),
  
  // Expected expenses (array of objects)
  expectedExpenses: json('expected_expenses').notNull(),
  
  // Expected outcomes (object)
  expectedOutcomes: json('expected_outcomes').notNull(),
});

export type ProjectProposal = typeof projectProposals.$inferSelect;
export type NewProjectProposal = typeof projectProposals.$inferInsert;