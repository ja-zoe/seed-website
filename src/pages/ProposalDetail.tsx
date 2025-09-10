import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { ProposalService } from '@/services/proposalService';
import { ProjectProposal } from '@/db/schema';
import { ArrowLeft, Download } from 'lucide-react';
import { exportProjectProposal } from '@/utils/exportUtils';
import type { z } from 'zod';
import { projectProposalFormSchema } from '@/schemas/ProjectProposalSchema';

type ProjectProposalFormData = z.infer<typeof projectProposalFormSchema>;

export default function ProposalDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [proposal, setProposal] = useState<ProjectProposal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('admin-authenticated');
    if (!isAuthenticated) {
      navigate('/admin');
      return;
    }

    loadProposal();
  }, [id, navigate]);

  const loadProposal = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      if (!id) {
        setError('Invalid proposal ID');
        return;
      }
      
      const proposalData = await ProposalService.getProposalById(parseInt(id));
      
      if (!proposalData) {
        setError('Proposal not found');
        return;
      }
      
      setProposal(proposalData);
    } catch (err) {
      setError('Failed to load proposal');
      console.error('Error loading proposal:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    if (!proposal) return;
    
    try {
      const formData: ProjectProposalFormData = {
        leads: proposal.leads as any,
        problemStatement: proposal.problemStatement as any,
        goal: proposal.goal as any,
        objectives: proposal.objectives as any,
        teamRoles: proposal.teamRoles as any,
        seedActivity: proposal.seedActivity as any,
        timeline: proposal.timeline as any,
        expectedExpenses: proposal.expectedExpenses as any,
        expectedOutcomes: proposal.expectedOutcomes as any,
      };
      
      exportProjectProposal(formData, `proposal-${proposal.id}`);
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  if (error) {
    return (
      <AdminLayout title="Proposal Details">
        <div className="text-center py-12">
          <div className="text-red-400 text-xl mb-4">⚠️ {error}</div>
          <Button onClick={() => navigate('/admin/dashboard')} variant="outline">
            Back to Dashboard
          </Button>
        </div>
      </AdminLayout>
    );
  }

  if (isLoading) {
    return (
      <AdminLayout title="Proposal Details">
        <div className="text-center py-12">
          <div className="text-green-200 text-xl">Loading proposal...</div>
        </div>
      </AdminLayout>
    );
  }

  if (!proposal) {
    return (
      <AdminLayout title="Proposal Details">
        <div className="text-center py-12">
          <div className="text-red-400 text-xl mb-4">Proposal not found</div>
          <Button onClick={() => navigate('/admin/dashboard')} variant="outline">
            Back to Dashboard
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const leads = proposal.leads as Array<{ name: string; email: string; phone: string }>;
  const problemStatement = proposal.problemStatement as any;
  const goal = proposal.goal as any;
  const objectives = proposal.objectives as string[];
  const teamRoles = proposal.teamRoles as any[] || [];
  const seedActivity = proposal.seedActivity as any;
  const timeline = proposal.timeline as any[];
  const expectedExpenses = proposal.expectedExpenses as any[];
  const expectedOutcomes = proposal.expectedOutcomes as any;

  return (
    <AdminLayout title={`Proposal #${proposal.id}`}>
      <div className="mb-6 flex justify-between items-center">
        <Button
          onClick={() => navigate('/admin/dashboard')}
          variant="outline"
          className="border-green-600 text-green-100 hover:bg-green-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        
        <Button
          onClick={handleExport}
          className="bg-green-600 hover:bg-green-500"
        >
          <Download className="h-4 w-4 mr-2" />
          Export to Excel
        </Button>
      </div>

      <div className="space-y-8">
        {/* Metadata */}
        <div className="bg-gradient-to-br from-green-800 to-green-900 p-6 rounded-xl border border-green-700">
          <h2 className="text-2xl font-bold text-green-100 mb-4">Proposal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-green-200">
            <div><strong>Proposal ID:</strong> #{proposal.id}</div>
            <div><strong>Submitted:</strong> {new Date(proposal.submittedAt).toLocaleString()}</div>
          </div>
        </div>

        {/* Project Leads */}
        <div className="bg-gradient-to-br from-green-800 to-green-900 p-6 rounded-xl border border-green-700">
          <h2 className="text-2xl font-bold text-green-100 mb-4">Project Leads</h2>
          <div className="space-y-4">
            {leads.map((lead, index) => (
              <div key={index} className="bg-green-700/30 p-4 rounded border border-green-600">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-green-200">
                  <div><strong>Name:</strong> {lead.name}</div>
                  <div><strong>Email:</strong> {lead.email}</div>
                  <div><strong>Phone:</strong> {lead.phone}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Problem Statement */}
        <div className="bg-gradient-to-br from-green-800 to-green-900 p-6 rounded-xl border border-green-700">
          <h2 className="text-2xl font-bold text-green-100 mb-4">Problem Statement</h2>
          <div className="space-y-4 text-green-200">
            <div>
              <h3 className="font-semibold text-green-100 mb-2">Environmental Issue:</h3>
              <p>{problemStatement.environmentalIssue}</p>
            </div>
            <div>
              <h3 className="font-semibold text-green-100 mb-2">Why It Matters:</h3>
              <p>{problemStatement.whyItMatters}</p>
            </div>
            <div>
              <h3 className="font-semibold text-green-100 mb-2">Past Attempts:</h3>
              <p>{problemStatement.pastAttempts}</p>
            </div>
            <div>
              <h3 className="font-semibold text-green-100 mb-2">Evidence and Lessons:</h3>
              <p>{problemStatement.evidenceAndLessons}</p>
            </div>
          </div>
        </div>

        {/* Project Goal */}
        <div className="bg-gradient-to-br from-green-800 to-green-900 p-6 rounded-xl border border-green-700">
          <h2 className="text-2xl font-bold text-green-100 mb-4">Project Goal</h2>
          <div className="space-y-4 text-green-200">
            <div>
              <h3 className="font-semibold text-green-100 mb-2">Overarching Aim:</h3>
              <p>{goal.overarchingAim}</p>
            </div>
            <div>
              <h3 className="font-semibold text-green-100 mb-2">How It Addresses Problem:</h3>
              <p>{goal.howItAddressesProblem}</p>
            </div>
            <div>
              <h3 className="font-semibold text-green-100 mb-2">Approach:</h3>
              <p>{goal.approach}</p>
            </div>
            <div>
              <h3 className="font-semibold text-green-100 mb-2">Expected Learning:</h3>
              <p>{goal.expectedLearning}</p>
            </div>
          </div>
        </div>

        {/* Objectives */}
        <div className="bg-gradient-to-br from-green-800 to-green-900 p-6 rounded-xl border border-green-700">
          <h2 className="text-2xl font-bold text-green-100 mb-4">Objectives</h2>
          <ol className="list-decimal list-inside space-y-2 text-green-200">
            {objectives.map((objective, index) => (
              <li key={index}>{objective}</li>
            ))}
          </ol>
        </div>

        {/* Timeline */}
        <div className="bg-gradient-to-br from-green-800 to-green-900 p-6 rounded-xl border border-green-700">
          <h2 className="text-2xl font-bold text-green-100 mb-4">Timeline</h2>
          <div className="space-y-4">
            {timeline.map((item, index) => (
              <div key={index} className="bg-green-700/30 p-4 rounded border border-green-600">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-green-200">
                  <div><strong>Task:</strong> {item.task}</div>
                  <div><strong>Deliverable:</strong> {item.deliverable}</div>
                  <div><strong>Start Date:</strong> {item.startDate}</div>
                  <div><strong>End Date:</strong> {item.endDate}</div>
                </div>
                {item.responsibleParty && (
                  <div className="mt-2 text-green-200">
                    <strong>Responsible Party:</strong> {item.responsibleParty}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Expected Expenses */}
        <div className="bg-gradient-to-br from-green-800 to-green-900 p-6 rounded-xl border border-green-700">
          <h2 className="text-2xl font-bold text-green-100 mb-4">Expected Expenses</h2>
          <div className="space-y-4">
            {expectedExpenses.map((expense, index) => (
              <div key={index} className="bg-green-700/30 p-4 rounded border border-green-600">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-green-200">
                  <div><strong>Item:</strong> {expense.item}</div>
                  <div><strong>Cost:</strong> {expense.cost}</div>
                </div>
                <div className="mt-2 text-green-200">
                  <strong>Purpose:</strong> {expense.purpose}
                </div>
                {expense.link && (
                  <div className="mt-2 text-green-200">
                    <strong>Link:</strong> <a href={expense.link} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:underline">{expense.link}</a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Expected Outcomes */}
        <div className="bg-gradient-to-br from-green-800 to-green-900 p-6 rounded-xl border border-green-700">
          <h2 className="text-2xl font-bold text-green-100 mb-4">Expected Outcomes</h2>
          <div className="space-y-4 text-green-200">
            <div>
              <h3 className="font-semibold text-green-100 mb-2">Accomplishments:</h3>
              <p>{expectedOutcomes.accomplishments}</p>
            </div>
            <div>
              <h3 className="font-semibold text-green-100 mb-2">Final Deliverable:</h3>
              <p>{expectedOutcomes.finalDeliverable}</p>
            </div>
            <div>
              <h3 className="font-semibold text-green-100 mb-2">Contribution to SEED:</h3>
              <p>{expectedOutcomes.contributionToSEED}</p>
            </div>
          </div>
        </div>

        {/* Team Roles (if provided) */}
        {teamRoles.length > 0 && (
          <div className="bg-gradient-to-br from-green-800 to-green-900 p-6 rounded-xl border border-green-700">
            <h2 className="text-2xl font-bold text-green-100 mb-4">Team Roles</h2>
            <div className="space-y-4">
              {teamRoles.map((role, index) => (
                <div key={index} className="bg-green-700/30 p-4 rounded border border-green-600">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-green-200 mb-2">
                    <div><strong>Role:</strong> {role.role}</div>
                    <div><strong>Team Member:</strong> {role.teamMember}</div>
                  </div>
                  <div className="text-green-200">
                    <strong>Responsibilities:</strong> {role.responsibilities}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SEED Activity (if provided) */}
        {seedActivity && (
          <div className="bg-gradient-to-br from-green-800 to-green-900 p-6 rounded-xl border border-green-700">
            <h2 className="text-2xl font-bold text-green-100 mb-4">SEED Member Activity</h2>
            <div className="space-y-4 text-green-200">
              <div>
                <h3 className="font-semibold text-green-100 mb-2">What:</h3>
                <p>{seedActivity.what}</p>
              </div>
              <div>
                <h3 className="font-semibold text-green-100 mb-2">When & Where:</h3>
                <p>{seedActivity.whenWhere}</p>
              </div>
              <div>
                <h3 className="font-semibold text-green-100 mb-2">Why:</h3>
                <p>{seedActivity.why}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}