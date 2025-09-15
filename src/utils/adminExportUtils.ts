import type { ProjectProposal } from "@/lib/supabase";

/**
 * Formats admin data for Excel export
 */
export function formatAdminDataForExport(proposals: ProjectProposal[]) {
  const exportData = {
    // Summary Sheet
    Summary: proposals.map((proposal, index) => ({
      "Proposal #": index + 1,
      "Submission Date": new Date(proposal.created_at!).toLocaleDateString(),
      "Primary Lead": proposal.leads[0]?.name || "N/A",
      "Primary Email": proposal.leads[0]?.email || "N/A",
      "Project Goal":
        proposal.goal.overarchingAim.substring(0, 100) +
        (proposal.goal.overarchingAim.length > 100 ? "..." : ""),
      "Total Budget": `$${proposal.expected_expenses
        .reduce((total, expense) => {
          const cost = parseFloat(expense.cost.replace(/[$,]/g, "")) || 0;
          return total + cost;
        }, 0)
        .toLocaleString()}`,
      "Number of Objectives": proposal.objectives.length,
      "Timeline Items": proposal.timeline.length,
      "Expense Items": proposal.expected_expenses.length,
    })),

    // All Project Leads
    "Project Leads": proposals.flatMap((proposal, proposalIndex) =>
      proposal.leads.map((lead, leadIndex) => ({
        "Proposal #": proposalIndex + 1,
        "Lead #": leadIndex + 1,
        Name: lead.name,
        Email: lead.email,
        Phone: lead.phone,
        "Submission Date": new Date(proposal.created_at!).toLocaleDateString(),
      }))
    ),

    // Problem Statements
    "Problem Statements": proposals.map((proposal, index) => ({
      "Proposal #": index + 1,
      "Primary Lead": proposal.leads[0]?.name || "N/A",
      "Environmental Issue": proposal.problem_statement.environmentalIssue,
      "Why It Matters": proposal.problem_statement.whyItMatters,
      "Past Attempts": proposal.problem_statement.pastAttempts,
      "Evidence and Lessons": proposal.problem_statement.evidenceAndLessons,
    })),

    // Project Goals
    "Project Goals": proposals.map((proposal, index) => ({
      "Proposal #": index + 1,
      "Primary Lead": proposal.leads[0]?.name || "N/A",
      "Overarching Aim": proposal.goal.overarchingAim,
      "How It Addresses Problem": proposal.goal.howItAddressesProblem,
      Approach: proposal.goal.approach,
      "Expected Learning": proposal.goal.expectedLearning,
    })),

    // All Objectives
    Objectives: proposals.flatMap((proposal, proposalIndex) =>
      proposal.objectives.map((objective, objectiveIndex) => ({
        "Proposal #": proposalIndex + 1,
        "Primary Lead": proposal.leads[0]?.name || "N/A",
        "Objective #": objectiveIndex + 1,
        Description: objective,
      }))
    ),

    // Team Roles
    "Team Roles": proposals.flatMap((proposal, proposalIndex) =>
      (proposal.team_roles || []).map((role, roleIndex) => ({
        "Proposal #": proposalIndex + 1,
        "Primary Lead": proposal.leads[0]?.name || "N/A",
        "Role #": roleIndex + 1,
        Role: role.role,
        "Team Member": role.teamMember,
        Responsibilities: role.responsibilities,
      }))
    ),

    // Timeline
    Timeline: proposals.flatMap((proposal, proposalIndex) =>
      proposal.timeline.map((item, itemIndex) => ({
        "Proposal #": proposalIndex + 1,
        "Primary Lead": proposal.leads[0]?.name || "N/A",
        "Timeline Item #": itemIndex + 1,
        Task: item.task,
        Deliverable: item.deliverable,
        "Start Date": item.startDate,
        "End Date": item.endDate,
        "Responsible Party": item.responsibleParty || "Not specified",
      }))
    ),

    // Expenses
    Expenses: proposals.flatMap((proposal, proposalIndex) =>
      proposal.expected_expenses.map((expense, expenseIndex) => ({
        "Proposal #": proposalIndex + 1,
        "Primary Lead": proposal.leads[0]?.name || "N/A",
        "Expense Item #": expenseIndex + 1,
        Item: expense.item,
        Purpose: expense.purpose,
        Cost: expense.cost,
        Link: expense.link || "Not provided",
      }))
    ),

    // Expected Outcomes
    "Expected Outcomes": proposals.map((proposal, index) => ({
      "Proposal #": index + 1,
      "Primary Lead": proposal.leads[0]?.name || "N/A",
      "Expected Accomplishments": proposal.expected_outcomes.accomplishments,
      "Final Deliverable": proposal.expected_outcomes.finalDeliverable,
      "Contribution to SEED": proposal.expected_outcomes.contributionToSEED,
    })),

    // SEED Activities
    "SEED Activities": proposals
      .filter((proposal) => proposal.seed_activity)
      .map((proposal) => ({
        "Proposal #": proposals.indexOf(proposal) + 1,
        "Primary Lead": proposal.leads[0]?.name || "N/A",
        "Activity Description": proposal.seed_activity!.what,
        "Date and Location": proposal.seed_activity!.whenWhere,
        Relevance: proposal.seed_activity!.why,
      })),
  };

  return exportData;
}

/**
 * Exports admin data to Excel format
 */
export async function exportProposalsToExcel(
  proposals: ProjectProposal[],
  filename?: string
) {
  try {
    const XLSX = await import("xlsx");

    const exportData = formatAdminDataForExport(proposals);
    const workbook = XLSX.utils.book_new();

    // Create worksheets for each section
    Object.entries(exportData).forEach(([sectionName, sectionData]) => {
      let worksheet;

      if (Array.isArray(sectionData)) {
        if (sectionData.length > 0) {
          worksheet = XLSX.utils.json_to_sheet(sectionData);

          // Auto-size columns
          const cols = Object.keys(sectionData[0]).map((key) => ({
            wch: Math.max(key.length, 15),
          }));
          worksheet["!cols"] = cols;
        } else {
          worksheet = XLSX.utils.aoa_to_sheet([["No data available"]]);
        }
      } else {
        worksheet = XLSX.utils.aoa_to_sheet([["No data available"]]);
      }

      // Clean sheet name for Excel compatibility
      const cleanSheetName = sectionName
        .replace(/[\\\/\?\*\[\]]/g, "")
        .substring(0, 31);
      XLSX.utils.book_append_sheet(workbook, worksheet, cleanSheetName);
    });

    // Add metadata sheet
    const metadataSheet = XLSX.utils.aoa_to_sheet([
      ["SEED Project Proposals - Admin Export"],
      ["Generated on:", new Date().toLocaleDateString()],
      ["Generated at:", new Date().toLocaleTimeString()],
      ["Total Proposals:", proposals.length.toString()],
      [
        "Total Budget Requested:",
        `$${proposals
          .reduce((total, proposal) => {
            return (
              total +
              proposal.expected_expenses.reduce((expenseTotal, expense) => {
                const cost = parseFloat(expense.cost.replace(/[$,]/g, "")) || 0;
                return expenseTotal + cost;
              }, 0)
            );
          }, 0)
          .toLocaleString()}`,
      ],
      [
        "Unique Project Leads:",
        new Set(
          proposals.flatMap((p) => p.leads.map((l) => l.email))
        ).size.toString(),
      ],
    ]);
    XLSX.utils.book_append_sheet(workbook, metadataSheet, "Export Info");

    // Generate filename
    const defaultFilename = `seed-proposals-admin-export-${
      new Date().toISOString().split("T")[0]
    }`;
    const finalFilename = filename || defaultFilename;

    // Export the file
    XLSX.writeFile(workbook, `${finalFilename}.xlsx`);

    return true;
  } catch (error) {
    console.error("Excel export failed:", error);
    return false;
  }
}

/**
 * Exports a single proposal to Excel
 */
export async function exportSingleProposal(
  proposal: ProjectProposal,
  filename?: string
) {
  return exportProposalsToExcel([proposal], filename);
}
