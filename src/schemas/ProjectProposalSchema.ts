import { z } from "zod";

const rutgersEmailRegex =
  /^[a-zA-Z0-9._%+-]+@(rutgers\.edu|scarletmail\.rutgers\.edu)$/;

const leadSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email({
    pattern: rutgersEmailRegex,
    message: "Email must be a valid Rutgers address",
  }),
  phone: z.string().min(1, "Phone number is required"),
});

const timelineItemSchema = z.object({
  task: z.string().min(1, "Task description is required"),
  deliverable: z.string().min(1, "Deliverable description is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  responsibleParty: z.string().optional(),
});

const expenseItemSchema = z.object({
  item: z.string().min(1, "Item name is required"),
  purpose: z.string().min(1, "Purpose is required"),
  cost: z.string().min(1, "Cost is required"),
  link: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

const teamRoleSchema = z.object({
  role: z.string().min(1, "Role is required"),
  responsibilities: z.string().min(1, "Responsibilities are required"),
  teamMember: z.string().min(1, "Team member name is required"),
});

const problemStatementSchema = z.object({
  environmentalIssue: z
    .string()
    .min(1, "Environmental issue description is required"),
  whyItMatters: z
    .string()
    .min(1, "Environmental/social impact explanation is required"),
  pastAttempts: z.string().min(1, "Description of past attempts is required"),
  evidenceAndLessons: z
    .string()
    .min(1, "Evidence of successes/failures and lessons learned is required"),
});

const goalSchema = z.object({
  overarchingAim: z.string().min(1, "Overarching aim is required"),
  howItAddressesProblem: z
    .string()
    .min(1, "How it addresses the problem is required"),
  approach: z.string().min(1, "Approach description is required"),
  expectedLearning: z
    .string()
    .min(1, "Expected learning outcomes are required"),
});

const expectedOutcomesSchema = z.object({
  accomplishments: z.string().min(1, "Expected accomplishments are required"),
  finalDeliverable: z
    .string()
    .min(1, "Final deliverable description is required"),
  contributionToSEED: z
    .string()
    .min(1, "Contribution to SEED's mission is required"),
});

const seedActivitySchema = z.object({
  what: z.string().min(1, "Activity description is required"),
  whenWhere: z.string().min(1, "Date and location are required"),
  why: z.string().min(1, "Relevance explanation is required"),
});

const projectProposalFormSchema = z.object({
  leads: z.array(leadSchema).min(1, "At least one project lead is required"),

  // Problem Statement
  problemStatement: problemStatementSchema,

  // Goal
  goal: goalSchema,

  // Objectives
  objectives: z
    .array(z.string().min(1, "Objective cannot be empty"))
    .min(1, "At least one objective is required"),

  // Team Roles & Tasks (Optional unless filled)
  teamRoles: z
    .array(teamRoleSchema)
    .optional()
    .refine(
      (roles: any) => {
        // If no roles provided, it's valid
        if (!roles || roles.length === 0) return true;

        // If roles are provided, they must be complete
        return roles.every(
          (role: any) =>
            role.role.trim() !== "" &&
            role.responsibilities.trim() !== "" &&
            role.teamMember.trim() !== ""
        );
      },
      {
        message: "If team roles are provided, all fields must be completed",
      }
    ),

  // SEED Member Activity (Optional)
  seedActivity: seedActivitySchema.optional(),

  // Timeline
  timeline: z
    .array(timelineItemSchema)
    .min(1, "At least one timeline item is required"),

  // Expected Expenses
  expectedExpenses: z
    .array(expenseItemSchema)
    .min(1, "At least one expense item is required"),

  // Expected Outcomes
  expectedOutcomes: expectedOutcomesSchema,
});

export { projectProposalFormSchema };
