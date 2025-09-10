import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X, Download } from "lucide-react";
import { useEffect } from "react";
import { projectProposalFormSchema } from "@/schemas/ProjectProposalSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { exportProjectProposal } from "@/utils/exportUtils";
import type { z } from "zod";

type ProjectProposalFormData = z.infer<typeof projectProposalFormSchema>;

const STORAGE_KEY = "seed-project-proposal-draft";

const getDefaultValues = (): ProjectProposalFormData => ({
  leads: [{ name: "", email: "", phone: "" }],
  problemStatement: {
    environmentalIssue: "",
    whyItMatters: "",
    pastAttempts: "",
    evidenceAndLessons: "",
  },
  goal: {
    overarchingAim: "",
    howItAddressesProblem: "",
    approach: "",
    expectedLearning: "",
  },
  objectives: [""],
  teamRoles: [{ role: "", responsibilities: "", teamMember: "" }],
  timeline: [
    {
      task: "",
      deliverable: "",
      startDate: "",
      endDate: "",
      responsibleParty: "",
    },
  ],
  expectedExpenses: [
    {
      item: "",
      purpose: "",
      cost: "",
      link: "",
    },
  ],
  expectedOutcomes: {
    accomplishments: "",
    finalDeliverable: "",
    contributionToSEED: "",
  },
  seedActivity: {
    what: "",
    whenWhere: "",
    why: "",
  },
});

const loadSavedData = (): ProjectProposalFormData => {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      if (parsed && typeof parsed === 'object') {
        return { ...getDefaultValues(), ...parsed };
      }
    }
  } catch (error) {
    console.warn("Failed to load saved form data:", error);
  }
  return getDefaultValues();
};

const saveFormData = (data: ProjectProposalFormData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn("Failed to save form data:", error);
  }
};

const ProjectProposalForm = () => {
  const form = useForm<ProjectProposalFormData>({
    resolver: zodResolver(projectProposalFormSchema),
    defaultValues: loadSavedData(),
  });

  // Watch all form values and save to localStorage when they change
  const watchedValues = form.watch();
  
  useEffect(() => {
    saveFormData(watchedValues);
  }, [watchedValues]);

  // Clear saved data when form is successfully submitted
  const clearSavedData = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn("Failed to clear saved form data:", error);
    }
  };

  const onSubmit = async (data: ProjectProposalFormData) => {
    try {
      // Import the service dynamically to avoid SSR issues
      const { ProposalService } = await import('@/services/proposalService');
      
      // Save to database
      await ProposalService.createProposal({
        leads: data.leads,
        problemStatement: data.problemStatement,
        goal: data.goal,
        objectives: data.objectives,
        teamRoles: data.teamRoles,
        seedActivity: data.seedActivity,
        timeline: data.timeline,
        expectedExpenses: data.expectedExpenses,
        expectedOutcomes: data.expectedOutcomes,
      });
      
      // Clear saved data after successful submission
      clearSavedData();
      
      // Show success message
      alert('Proposal submitted successfully! Thank you for your submission.');
      
      // Reset form
      form.reset(getDefaultValues());
      
    } catch (error) {
      console.error('Failed to submit proposal:', error);
      alert('Failed to submit proposal. Please try again or contact support.');
    }
  };

  const handleExport = () => {
    const formData = form.getValues();
    exportProjectProposal(formData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-100 mb-4">
          SEED Project Proposal Form
        </h1>
        <p className="text-green-200 text-lg">
          Please fill out all required sections to submit your project proposal
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Project Leads Section */}
          <div className="space-y-4 bg-gradient-to-br from-green-800 to-green-900 p-6 rounded-xl border border-green-700 shadow-lg">
            <h2 className="text-2xl font-bold text-green-100 mb-4">
              Project Leads
            </h2>
            {form.watch("leads").map((_, index) => (
              <div
                key={index}
                className="bg-green-700/30 border border-green-600 rounded-lg p-4 space-y-4"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-green-200">
                    Lead {index + 1}
                  </h3>
                  {form.watch("leads").length > 1 && (
                    <Button
                      type="button"
                      className="bg-red-600 hover:bg-red-500 text-white border-red-500 hover:border-red-400"
                      size="sm"
                      onClick={() => {
                        const currentLeads = form.getValues("leads");
                        form.setValue(
                          "leads",
                          currentLeads.filter((_, i) => i !== index)
                        );
                      }}
                    >
                      <X />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name={`leads.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-green-100 font-medium">
                          Name
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`leads.${index}.email`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-green-100 font-medium">
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="name@rutgers.edu"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`leads.${index}.phone`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-green-100 font-medium">
                          Phone
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}
            <Button
              type="button"
              className="bg-green-600 hover:bg-green-500 text-white border-green-500 hover:border-green-400"
              onClick={() => {
                const currentLeads = form.getValues("leads");
                form.setValue("leads", [
                  ...currentLeads,
                  { name: "", email: "", phone: "" },
                ]);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Lead
            </Button>
          </div>

          {/* Problem Statement Section */}
          <div className="space-y-4 bg-gradient-to-br from-green-800 to-green-900 p-6 rounded-xl border border-green-700 shadow-lg">
            <h2 className="text-2xl font-bold text-green-100 mb-4">
              Problem Statement
            </h2>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="problemStatement.environmentalIssue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-green-100 font-medium">
                      Environmental Issue
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the environmental issue your project addresses..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="problemStatement.whyItMatters"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-green-100 font-medium">
                      Why It Matters
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Explain the environmental/social impact and why this issue matters..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="problemStatement.pastAttempts"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Past Attempts</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe any past attempts to address this issue..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="problemStatement.evidenceAndLessons"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Evidence and Lessons Learned</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide evidence of successes/failures and lessons learned..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Goal Section */}
          <div className="space-y-4 bg-gradient-to-br from-green-800 to-green-900 p-6 rounded-xl border border-green-700 shadow-lg">
            <h2 className="text-2xl font-bold text-green-100 mb-4">
              Project Goal
            </h2>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="goal.overarchingAim"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Overarching Aim</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="What is the overarching aim of your project?"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="goal.howItAddressesProblem"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>How It Addresses the Problem</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="How does your project address the identified problem?"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="goal.approach"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Approach</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your approach to achieving the goal..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="goal.expectedLearning"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expected Learning Outcomes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="What learning outcomes do you expect from this project?"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Objectives Section */}
          <div className="space-y-4 bg-gradient-to-br from-green-800 to-green-900 p-6 rounded-xl border border-green-700 shadow-lg">
            <h2 className="text-2xl font-bold text-green-100 mb-4">
              Objectives
            </h2>
            {form.watch("objectives").map((_, index) => (
              <div key={index} className="flex gap-2 items-start">
                <FormField
                  control={form.control}
                  name={`objectives.${index}`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Textarea
                          placeholder={`Objective ${index + 1}`}
                          className="min-h-[60px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {form.watch("objectives").length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      const currentObjectives = form.getValues("objectives");
                      form.setValue(
                        "objectives",
                        currentObjectives.filter((_, i) => i !== index)
                      );
                    }}
                  >
                    <X />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              className="bg-green-600 hover:bg-green-500 text-white border-green-500 hover:border-green-400"
              onClick={() => {
                const currentObjectives = form.getValues("objectives");
                form.setValue("objectives", [...currentObjectives, ""]);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Objective
            </Button>
          </div>

          {/* Team Roles Section */}
          <div className="space-y-4 bg-gradient-to-br from-green-800 to-green-900 p-6 rounded-xl border border-green-700 shadow-lg">
            <h2 className="text-2xl font-bold text-green-100 mb-4">
              Team Roles & Tasks
              <span className="text-sm font-normal text-green-300 ml-2">
                (Optional)
              </span>
            </h2>
            {(form.watch("teamRoles") || []).map((_, index) => (
              <div
                key={index}
                className="bg-green-700/30 border border-green-600 rounded-lg p-4 space-y-4"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-green-200">
                    Role {index + 1}
                  </h3>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      const currentRoles = form.getValues("teamRoles") || [];
                      const newRoles = currentRoles.filter(
                        (_, i) => i !== index
                      );
                      form.setValue("teamRoles", newRoles);
                    }}
                  >
                    <X />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name={`teamRoles.${index}.role`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <FormControl>
                          <Input placeholder="Role title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`teamRoles.${index}.teamMember`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Team Member</FormLabel>
                        <FormControl>
                          <Input placeholder="Team member name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name={`teamRoles.${index}.responsibilities`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Responsibilities</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the responsibilities for this role..."
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
            <Button
              type="button"
              className="bg-green-600 hover:bg-green-500 text-white border-green-500 hover:border-green-400"
              onClick={() => {
                const currentRoles = form.getValues("teamRoles") || [];
                form.setValue("teamRoles", [
                  ...currentRoles,
                  { role: "", responsibilities: "", teamMember: "" },
                ]);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Role
            </Button>
          </div>

          {/* SEED Activity Section (Optional) */}
          <div className="space-y-4 bg-gradient-to-br from-green-800 to-green-900 p-6 rounded-xl border border-green-700 shadow-lg">
            <h2 className="text-2xl font-bold text-green-100 mb-4">
              SEED Member Activity
              <span className="text-sm font-normal text-green-300 ml-2">
                (Optional)
              </span>
            </h2>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="seedActivity.what"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Activity Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the SEED member activity..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="seedActivity.whenWhere"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date and Location</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="When and where will this activity take place?"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="seedActivity.why"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Relevance</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Why is this activity relevant to your project?"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Timeline Section */}
          <div className="space-y-4 bg-gradient-to-br from-green-800 to-green-900 p-6 rounded-xl border border-green-700 shadow-lg">
            <h2 className="text-2xl font-bold text-green-100 mb-4">
              Project Timeline
            </h2>
            {form.watch("timeline").map((_, index) => (
              <div
                key={index}
                className="bg-green-700/30 border border-green-600 rounded-lg p-4 space-y-4"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-green-200">
                    Timeline Item {index + 1}
                  </h3>
                  {form.watch("timeline").length > 1 && (
                    <Button
                      type="button"
                      className="bg-red-600 hover:bg-red-500 text-white border-red-500 hover:border-red-400"
                      size="sm"
                      onClick={() => {
                        const currentTimeline = form.getValues("timeline");
                        form.setValue(
                          "timeline",
                          currentTimeline.filter((_, i) => i !== index)
                        );
                      }}
                    >
                      <X />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`timeline.${index}.task`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Task</FormLabel>
                        <FormControl>
                          <Input placeholder="Task name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`timeline.${index}.deliverable`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deliverable</FormLabel>
                        <FormControl>
                          <Input placeholder="Expected deliverable" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`timeline.${index}.startDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`timeline.${index}.endDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name={`timeline.${index}.responsibleParty`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Responsible Party</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Who is responsible for this task?"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
            <Button
              type="button"
              className="bg-green-600 hover:bg-green-500 text-white border-green-500 hover:border-green-400"
              onClick={() => {
                const currentTimeline = form.getValues("timeline");
                form.setValue("timeline", [
                  ...currentTimeline,
                  {
                    task: "",
                    deliverable: "",
                    startDate: "",
                    endDate: "",
                    responsibleParty: "",
                  },
                ]);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Timeline Item
            </Button>
          </div>

          {/* Expected Expenses Section */}
          <div className="space-y-4 bg-gradient-to-br from-green-800 to-green-900 p-6 rounded-xl border border-green-700 shadow-lg">
            <h2 className="text-2xl font-bold text-green-100 mb-4">
              Expected Expenses
            </h2>
            {form.watch("expectedExpenses").map((_, index) => (
              <div
                key={index}
                className="bg-green-700/30 border border-green-600 rounded-lg p-4 space-y-4"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-green-200">
                    Expense {index + 1}
                  </h3>
                  {form.watch("expectedExpenses").length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        const currentExpenses = form.getValues("expectedExpenses");
                        form.setValue(
                          "expectedExpenses",
                          currentExpenses.filter((_, i) => i !== index)
                        );
                      }}
                    >
                      <X />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`expectedExpenses.${index}.item`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Item</FormLabel>
                        <FormControl>
                          <Input placeholder="Expense item" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`expectedExpenses.${index}.cost`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cost</FormLabel>
                        <FormControl>
                          <Input placeholder="$0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name={`expectedExpenses.${index}.purpose`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Purpose</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Why is this expense necessary?"
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`expectedExpenses.${index}.link`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Link (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Link to product or vendor"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
            <Button
              type="button"
              className="bg-green-600 hover:bg-green-500 text-white border-green-500 hover:border-green-400"
              onClick={() => {
                const currentExpenses = form.getValues("expectedExpenses");
                form.setValue("expectedExpenses", [
                  ...currentExpenses,
                  { item: "", purpose: "", cost: "", link: "" },
                ]);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Expense
            </Button>
          </div>

          {/* Expected Outcomes Section */}
          <div className="space-y-4 bg-gradient-to-br from-green-800 to-green-900 p-6 rounded-xl border border-green-700 shadow-lg">
            <h2 className="text-2xl font-bold text-green-100 mb-4">
              Expected Outcomes
            </h2>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="expectedOutcomes.accomplishments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Accomplishments</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="What will this project accomplish?"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expectedOutcomes.finalDeliverable"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Final Deliverable</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="What is the final deliverable of this project?"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expectedOutcomes.contributionToSEED"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contribution to SEED</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="How will this project contribute to SEED's mission?"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              onClick={handleExport}
              className="bg-blue-600 hover:bg-blue-500 text-white border-blue-500 hover:border-blue-400"
            >
              <Download className="h-4 w-4 mr-2" />
              Export to Excel
            </Button>
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-500 text-white border-green-500 hover:border-green-400"
            >
              Submit Proposal
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProjectProposalForm;