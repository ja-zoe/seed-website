import type { ProjectProposal } from '@/services/supabaseProposalService';
import { Button } from '@/components/ui/button';
import { Eye, Download } from 'lucide-react';

interface ProposalCardProps {
  proposal: ProjectProposal;
  onView: (id: number) => void;
  onExport: (proposal: ProjectProposal) => void;
}

export function ProposalCard({ proposal, onView, onExport }: ProposalCardProps) {
  const leads = proposal.leads as Array<{ name: string; email: string; phone: string }>;
  const primaryLead = leads[0];
  const problemStatement = proposal.problem_statement as { environmentalIssue: string };

  return (
    <div className="bg-gradient-to-br from-green-800 to-green-900 p-6 rounded-xl border border-green-700 shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-green-100 mb-2">
            Proposal #{proposal.id}
          </h3>
          <div className="space-y-1 text-green-200">
            <p><strong>Lead:</strong> {primaryLead?.name}</p>
            <p><strong>Email:</strong> {primaryLead?.email}</p>
            <p><strong>Submitted:</strong> {new Date(proposal.submitted_at).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex gap-2 ml-4">
          <Button
            onClick={() => onView(proposal.id)}
            size="sm"
            className="bg-blue-600 hover:bg-blue-500"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => onExport(proposal)}
            size="sm"
            className="bg-green-600 hover:bg-green-500"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="border-t border-green-600 pt-4">
        <h4 className="text-green-100 font-medium mb-2">Environmental Issue:</h4>
        <p className="text-green-200 text-sm line-clamp-3">
          {problemStatement?.environmentalIssue || 'No description provided'}
        </p>
      </div>
    </div>
  );
}