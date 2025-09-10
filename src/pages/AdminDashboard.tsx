import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ProposalCard } from '@/components/admin/ProposalCard';
import { ProposalStats } from '@/components/admin/ProposalStats';
import { SearchBar } from '@/components/admin/SearchBar';
import { ProposalService } from '@/services/proposalService';
import { ProjectProposal } from '@/db/schema';
import { exportProjectProposal } from '@/utils/exportUtils';
import type { z } from 'zod';
import { projectProposalFormSchema } from '@/schemas/ProjectProposalSchema';

type ProjectProposalFormData = z.infer<typeof projectProposalFormSchema>;

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [proposals, setProposals] = useState<ProjectProposal[]>([]);
  const [stats, setStats] = useState({ total: 0, recent: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('admin-authenticated');
    if (!isAuthenticated) {
      navigate('/admin');
      return;
    }

    loadData();
  }, [navigate]);

  const loadData = async (searchTerm?: string) => {
    try {
      setIsLoading(true);
      setError('');
      
      const [proposalsData, statsData] = await Promise.all([
        ProposalService.getProposals(searchTerm),
        ProposalService.getStatistics()
      ]);
      
      setProposals(proposalsData);
      setStats(statsData);
    } catch (err) {
      setError('Failed to load proposals. Please check your database connection.');
      console.error('Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (term: string) => {
    loadData(term);
  };

  const handleViewProposal = (id: number) => {
    navigate(`/admin/proposal/${id}`);
  };

  const handleExportProposal = (proposal: ProjectProposal) => {
    try {
      // Convert database format back to form format for export
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
      <AdminLayout title="Dashboard">
        <div className="text-center py-12">
          <div className="text-red-400 text-xl mb-4">⚠️ Error</div>
          <p className="text-red-300 mb-4">{error}</p>
          <button 
            onClick={() => loadData()}
            className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Project Proposals Dashboard">
      <ProposalStats total={stats.total} recent={stats.recent} />
      
      <SearchBar onSearch={handleSearch} isLoading={isLoading} />

      {isLoading ? (
        <div className="text-center py-12">
          <div className="text-green-200 text-xl">Loading proposals...</div>
        </div>
      ) : proposals.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-green-200 text-xl mb-4">No proposals found</div>
          <p className="text-green-300">
            When users submit proposals, they will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {proposals.map((proposal) => (
            <ProposalCard
              key={proposal.id}
              proposal={proposal}
              onView={handleViewProposal}
              onExport={handleExportProposal}
            />
          ))}
        </div>
      )}
    </AdminLayout>
  );
}