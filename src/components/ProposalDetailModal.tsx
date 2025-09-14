import { X, Calendar, Users, DollarSign, Target, FileText, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { ProjectProposal } from '@/lib/supabase';

interface ProposalDetailModalProps {
  proposal: ProjectProposal | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProposalDetailModal = ({ proposal, isOpen, onClose }: ProposalDetailModalProps) => {
  if (!isOpen || !proposal) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateTotalBudget = (expenses: ProjectProposal['expected_expenses']) => {
    return expenses.reduce((total, expense) => {
      const cost = parseFloat(expense.cost.replace(/[$,]/g, '')) || 0;
      return total + cost;
    }, 0);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-green-900 rounded-lg border border-green-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-green-700">
          <div>
            <h2 className="text-2xl font-bold text-green-100">Project Proposal Details</h2>
            <p className="text-green-300 text-sm mt-1">
              Submitted on {formatDate(proposal.created_at!)}
            </p>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-green-300 hover:text-green-100 hover:bg-green-800"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-8">
          {/* Project Leads */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-green-400" />
              <h3 className="text-xl font-semibold text-green-100">Project Leads</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {proposal.leads.map((lead, index) => (
                <div key={index} className="bg-green-800/50 rounded-lg p-4 border border-green-700">
                  <div className="font-medium text-green-100">{lead.name}</div>
                  <div className="text-green-300 text-sm">{lead.email}</div>
                  <div className="text-green-300 text-sm">{lead.phone}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Problem Statement */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-green-400" />
              <h3 className="text-xl font-semibold text-green-100">Problem Statement</h3>
            </div>
            <div className="space-y-4">
              <div className="bg-green-800/50 rounded-lg p-4 border border-green-700">
                <h4 className="font-medium text-green-200 mb-2">Environmental Issue</h4>
                <p className="text-green-100 text-sm leading-relaxed">
                  {proposal.problem_statement.environmentalIssue}
                </p>
              </div>
              <div className="bg-green-800/50 rounded-lg p-4 border border-green-700">
                <h4 className="font-medium text-green-200 mb-2">Why It Matters</h4>
                <p className="text-green-100 text-sm leading-relaxed">
                  {proposal.problem_statement.whyItMatters}
                </p>
              </div>
              <div className="bg-green-800/50 rounded-lg p-4 border border-green-700">
                <h4 className="font-medium text-green-200 mb-2">Past Attempts</h4>
                <p className="text-green-100 text-sm leading-relaxed">
                  {proposal.problem_statement.pastAttempts}
                </p>
              </div>
              <div className="bg-green-800/50 rounded-lg p-4 border border-green-700">
                <h4 className="font-medium text-green-200 mb-2">Evidence and Lessons Learned</h4>
                <p className="text-green-100 text-sm leading-relaxed">
                  {proposal.problem_statement.evidenceAndLessons}
                </p>
              </div>
            </div>
          </section>

          {/* Project Goal */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-green-400" />
              <h3 className="text-xl font-semibold text-green-100">Project Goal</h3>
            </div>
            <div className="space-y-4">
              <div className="bg-green-800/50 rounded-lg p-4 border border-green-700">
                <h4 className="font-medium text-green-200 mb-2">Overarching Aim</h4>
                <p className="text-green-100 text-sm leading-relaxed">
                  {proposal.goal.overarchingAim}
                </p>
              </div>
              <div className="bg-green-800/50 rounded-lg p-4 border border-green-700">
                <h4 className="font-medium text-green-200 mb-2">How It Addresses the Problem</h4>
                <p className="text-green-100 text-sm leading-relaxed">
                  {proposal.goal.howItAddressesProblem}
                </p>
              </div>
              <div className="bg-green-800/50 rounded-lg p-4 border border-green-700">
                <h4 className="font-medium text-green-200 mb-2">Approach</h4>
                <p className="text-green-100 text-sm leading-relaxed">
                  {proposal.goal.approach}
                </p>
              </div>
              <div className="bg-green-800/50 rounded-lg p-4 border border-green-700">
                <h4 className="font-medium text-green-200 mb-2">Expected Learning Outcomes</h4>
                <p className="text-green-100 text-sm leading-relaxed">
                  {proposal.goal.expectedLearning}
                </p>
              </div>
            </div>
          </section>

          {/* Objectives */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-green-400" />
              <h3 className="text-xl font-semibold text-green-100">Objectives</h3>
            </div>
            <div className="space-y-2">
              {proposal.objectives.map((objective, index) => (
                <div key={index} className="bg-green-800/50 rounded-lg p-3 border border-green-700">
                  <div className="flex items-start gap-3">
                    <Badge variant="secondary" className="bg-green-700 text-green-100 mt-0.5">
                      {index + 1}
                    </Badge>
                    <p className="text-green-100 text-sm leading-relaxed flex-1">
                      {objective}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Team Roles */}
          {proposal.team_roles && proposal.team_roles.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-green-400" />
                <h3 className="text-xl font-semibold text-green-100">Team Roles</h3>
              </div>
              <div className="space-y-4">
                {proposal.team_roles.map((role, index) => (
                  <div key={index} className="bg-green-800/50 rounded-lg p-4 border border-green-700">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-green-200">{role.role}</h4>
                      <Badge variant="outline" className="border-green-600 text-green-300">
                        {role.teamMember}
                      </Badge>
                    </div>
                    <p className="text-green-100 text-sm leading-relaxed">
                      {role.responsibilities}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* SEED Activity */}
          {proposal.seed_activity && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Target className="h-5 w-5 text-green-400" />
                <h3 className="text-xl font-semibold text-green-100">SEED Member Activity</h3>
              </div>
              <div className="space-y-4">
                <div className="bg-green-800/50 rounded-lg p-4 border border-green-700">
                  <h4 className="font-medium text-green-200 mb-2">Activity Description</h4>
                  <p className="text-green-100 text-sm leading-relaxed">
                    {proposal.seed_activity.what}
                  </p>
                </div>
                <div className="bg-green-800/50 rounded-lg p-4 border border-green-700">
                  <h4 className="font-medium text-green-200 mb-2">Date and Location</h4>
                  <p className="text-green-100 text-sm leading-relaxed">
                    {proposal.seed_activity.whenWhere}
                  </p>
                </div>
                <div className="bg-green-800/50 rounded-lg p-4 border border-green-700">
                  <h4 className="font-medium text-green-200 mb-2">Relevance</h4>
                  <p className="text-green-100 text-sm leading-relaxed">
                    {proposal.seed_activity.why}
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Timeline */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-green-400" />
              <h3 className="text-xl font-semibold text-green-100">Project Timeline</h3>
            </div>
            <div className="space-y-4">
              {proposal.timeline.map((item, index) => (
                <div key={index} className="bg-green-800/50 rounded-lg p-4 border border-green-700">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="bg-green-700 text-green-100">
                      {index + 1}
                    </Badge>
                    <h4 className="font-medium text-green-200">{item.task}</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <div>
                      <p className="text-green-300 text-xs mb-1">Deliverable</p>
                      <p className="text-green-100 text-sm">{item.deliverable}</p>
                    </div>
                    <div>
                      <p className="text-green-300 text-xs mb-1">Timeline</p>
                      <p className="text-green-100 text-sm">
                        {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    {item.responsibleParty && (
                      <div className="md:col-span-2">
                        <p className="text-green-300 text-xs mb-1">Responsible Party</p>
                        <p className="text-green-100 text-sm">{item.responsibleParty}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Expected Expenses */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="h-5 w-5 text-green-400" />
              <h3 className="text-xl font-semibold text-green-100">Expected Expenses</h3>
              <Badge variant="secondary" className="bg-green-700 text-green-100">
                Total: ${calculateTotalBudget(proposal.expected_expenses).toLocaleString()}
              </Badge>
            </div>
            <div className="space-y-4">
              {proposal.expected_expenses.map((expense, index) => (
                <div key={index} className="bg-green-800/50 rounded-lg p-4 border border-green-700">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-green-200">{expense.item}</h4>
                    <Badge variant="outline" className="border-green-600 text-green-300">
                      {expense.cost}
                    </Badge>
                  </div>
                  <p className="text-green-100 text-sm leading-relaxed mb-2">
                    {expense.purpose}
                  </p>
                  {expense.link && (
                    <a
                      href={expense.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-400 hover:text-green-300 text-sm underline"
                    >
                      View Product Link
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Expected Outcomes */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-green-400" />
              <h3 className="text-xl font-semibold text-green-100">Expected Outcomes</h3>
            </div>
            <div className="space-y-4">
              <div className="bg-green-800/50 rounded-lg p-4 border border-green-700">
                <h4 className="font-medium text-green-200 mb-2">Expected Accomplishments</h4>
                <p className="text-green-100 text-sm leading-relaxed">
                  {proposal.expected_outcomes.accomplishments}
                </p>
              </div>
              <div className="bg-green-800/50 rounded-lg p-4 border border-green-700">
                <h4 className="font-medium text-green-200 mb-2">Final Deliverable</h4>
                <p className="text-green-100 text-sm leading-relaxed">
                  {proposal.expected_outcomes.finalDeliverable}
                </p>
              </div>
              <div className="bg-green-800/50 rounded-lg p-4 border border-green-700">
                <h4 className="font-medium text-green-200 mb-2">Contribution to SEED's Mission</h4>
                <p className="text-green-100 text-sm leading-relaxed">
                  {proposal.expected_outcomes.contributionToSEED}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProposalDetailModal;