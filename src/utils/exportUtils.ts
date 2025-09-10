import type { z } from "zod";
import { projectProposalFormSchema } from "@/schemas/ProjectProposalSchema";

type ProjectProposalFormData = z.infer<typeof projectProposalFormSchema>;

/**
 * Converts form data to a structured format for Excel export
 */
export function formatDataForExport(data: ProjectProposalFormData) {
  const exportData = {
    // Project Leads
    "Project Leads": data.leads.map((lead, index) => ({
      "Lead Number": index + 1,
      "Name": lead.name,
      "Email": lead.email,
      "Phone": lead.phone,
    })),

    // Problem Statement
    "Problem Statement": {
      "Environmental Issue": data.problemStatement.environmentalIssue,
      "Why It Matters": data.problemStatement.whyItMatters,
      "Past Attempts": data.problemStatement.pastAttempts,
      "Evidence and Lessons Learned": data.problemStatement.evidenceAndLessons,
    },

    // Project Goal
    "Project Goal": {
      "Overarching Aim": data.goal.overarchingAim,
      "How It Addresses Problem": data.goal.howItAddressesProblem,
      "Approach": data.goal.approach,
      "Expected Learning Outcomes": data.goal.expectedLearning,
    },

    // Objectives
    "Objectives": data.objectives.map((objective, index) => ({
      "Objective Number": index + 1,
      "Description": objective,
    })),

    // Team Roles (if provided)
    "Team Roles": data.teamRoles?.map((role, index) => ({
      "Role Number": index + 1,
      "Role": role.role,
      "Team Member": role.teamMember,
      "Responsibilities": role.responsibilities,
    })) || [],

    // SEED Activity (if provided)
    "SEED Member Activity": data.seedActivity ? {
      "Activity Description": data.seedActivity.what,
      "Date and Location": data.seedActivity.whenWhere,
      "Relevance": data.seedActivity.why,
    } : null,

    // Timeline
    "Project Timeline": data.timeline.map((item, index) => ({
      "Timeline Item": index + 1,
      "Task": item.task,
      "Deliverable": item.deliverable,
      "Start Date": item.startDate,
      "End Date": item.endDate,
      "Responsible Party": item.responsibleParty || "Not specified",
    })),

    // Expected Expenses
    "Expected Expenses": data.expectedExpenses.map((expense, index) => ({
      "Expense Item": index + 1,
      "Item": expense.item,
      "Purpose": expense.purpose,
      "Cost": expense.cost,
      "Link": expense.link || "Not provided",
    })),

    // Expected Outcomes
    "Expected Outcomes": {
      "Expected Accomplishments": data.expectedOutcomes.accomplishments,
      "Final Deliverable": data.expectedOutcomes.finalDeliverable,
      "Contribution to SEED's Mission": data.expectedOutcomes.contributionToSEED,
    },
  };

  return exportData;
}

/**
 * Exports data to CSV format (fallback when xlsx is not available)
 */
export function exportToCSV(data: ProjectProposalFormData, filename: string = "seed-project-proposal") {
  const exportData = formatDataForExport(data);
  const csvContent = convertToCSV(exportData);
  
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

/**
 * Converts structured data to CSV format
 */
function convertToCSV(data: any): string {
  let csv = "";
  
  // Add header
  csv += "SEED Project Proposal Form Export\n";
  csv += `Generated on: ${new Date().toLocaleDateString()}\n\n`;
  
  // Process each section
  Object.entries(data).forEach(([sectionName, sectionData]) => {
    csv += `\n=== ${sectionName.toUpperCase()} ===\n`;
    
    if (Array.isArray(sectionData)) {
      if (sectionData.length === 0) {
        csv += "No data provided\n";
      } else {
        // Get headers from first item
        const headers = Object.keys(sectionData[0]);
        csv += headers.join(",") + "\n";
        
        // Add data rows
        sectionData.forEach((item: any) => {
          const row = headers.map(header => {
            const value = item[header] || "";
            // Escape commas and quotes in CSV
            return `"${String(value).replace(/"/g, '""')}"`;
          });
          csv += row.join(",") + "\n";
        });
      }
    } else if (sectionData && typeof sectionData === "object") {
      // Handle object sections
      Object.entries(sectionData).forEach(([key, value]) => {
        csv += `"${key}","${String(value || "").replace(/"/g, '""')}"\n`;
      });
    } else {
      csv += "No data provided\n";
    }
  });
  
  return csv;
}

/**
 * Exports data to Excel format (requires xlsx library)
 */
export async function exportToExcel(data: ProjectProposalFormData, filename: string = "seed-project-proposal") {
  try {
    // Dynamic import to handle cases where xlsx might not be installed
    const XLSX = await import("xlsx");
    
    const exportData = formatDataForExport(data);
    const workbook = XLSX.utils.book_new();
    
    // Create worksheets for each section
    Object.entries(exportData).forEach(([sectionName, sectionData]) => {
      let worksheet;
      
      if (Array.isArray(sectionData)) {
        if (sectionData.length > 0) {
          worksheet = XLSX.utils.json_to_sheet(sectionData);
        } else {
          worksheet = XLSX.utils.aoa_to_sheet([["No data provided"]]);
        }
      } else if (sectionData && typeof sectionData === "object") {
        const rows = Object.entries(sectionData).map(([key, value]) => [key, value]);
        worksheet = XLSX.utils.aoa_to_sheet([["Field", "Value"], ...rows]);
      } else {
        worksheet = XLSX.utils.aoa_to_sheet([["No data provided"]]);
      }
      
      // Clean sheet name (Excel has restrictions on sheet names)
      const cleanSheetName = sectionName.replace(/[\\\/\?\*\[\]]/g, "").substring(0, 31);
      XLSX.utils.book_append_sheet(workbook, worksheet, cleanSheetName);
    });
    
    // Add metadata sheet
    const metadataSheet = XLSX.utils.aoa_to_sheet([
      ["SEED Project Proposal Form Export"],
      ["Generated on:", new Date().toLocaleDateString()],
      ["Generated at:", new Date().toLocaleTimeString()],
      ["Total Sections:", Object.keys(exportData).length.toString()],
    ]);
    XLSX.utils.book_append_sheet(workbook, metadataSheet, "Metadata");
    
    // Export the file
    XLSX.writeFile(workbook, `${filename}.xlsx`);
    
    return true;
  } catch (error) {
    console.warn("Excel export failed, falling back to CSV:", error);
    exportToCSV(data, filename);
    return false;
  }
}

/**
 * Main export function that tries Excel first, then falls back to CSV
 */
export function exportProjectProposal(data: ProjectProposalFormData, filename?: string) {
  const defaultFilename = `seed-project-proposal-${new Date().toISOString().split('T')[0]}`;
  const finalFilename = filename || defaultFilename;
  
  // Try Excel export first
  exportToExcel(data, finalFilename).then((success) => {
    if (success) {
      console.log("Project proposal exported to Excel successfully");
    } else {
      console.log("Project proposal exported to CSV successfully");
    }
  });
}
