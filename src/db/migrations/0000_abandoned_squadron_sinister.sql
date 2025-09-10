CREATE TABLE "project_proposals" (
	"id" serial PRIMARY KEY NOT NULL,
	"submitted_at" timestamp DEFAULT now() NOT NULL,
	"leads" json NOT NULL,
	"problem_statement" json NOT NULL,
	"goal" json NOT NULL,
	"objectives" json NOT NULL,
	"team_roles" json,
	"seed_activity" json,
	"timeline" json NOT NULL,
	"expected_expenses" json NOT NULL,
	"expected_outcomes" json NOT NULL
);
