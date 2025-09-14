import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Eye, 
  Calendar, 
  Users, 
  DollarSign, 
  Target,
  LogOut,
  Filter,
  Download
} from 'lucide-react';
import type { ProjectProposal } from '@/lib/supabase';
import ProposalDetailModal from './ProposalDetailModal';
import { exportProposalsToExcel } from '@/utils/adminExportUtils';

interface AdminPanelProps {
  onLogout: () => void;
}

const AdminPanel = ({ onLogout }: AdminPanelProps) => {
  const [proposals, setProposals] = useState<ProjectProposal[]>([]);
  const [filteredProposals, setFilteredProposals] = useState<ProjectProposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProposal, setSelectedProposal] = useState<ProjectProposal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchProposals();
  }, []);

  useEffect(() => {
    filterProposals();
  }, [proposals, searchTerm]);

  const fetchProposals = async () => {
    try {
      const { data, error } = await supabase
        .from('project_proposals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching proposals:', error);
        return;
      }

      setProposals(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProposals = () => {
    if (!searchTerm.trim()) {
      setFilteredProposals(proposals);
      return;
    }

    const filtered = proposals.filter(proposal => {
      const searchLower = searchTerm.toLowerCase();
      
      // Search in leads names and emails
      const leadsMatch = proposal.leads.some(lead => 
        lead.name.toLowerCase().includes(searchLower) ||
        lead.email.toLowerCase().includes(searchLower)
      );

      // Search in problem statement
      const problemMatch = proposal.problem_statement.environmentalIssue.toLowerCase().includes(searchLower);

      // Search in goal
      const goalMatch = proposal.goal.overarchingAim.toLowerCase().includes(searchLower);

      return leadsMatch || problemMatch || goalMatch;
    });

    setFilteredProposals(filtered);
  };

  const handleViewProposal = (proposal: ProjectProposal) => {
    setSelectedProposal(proposal);
    setIsModalOpen(true);
  };

  const handleExportAll = () => {
    exportProposalsToExcel(proposals);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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

  if (loading) {
    return (
      <div className="min-h-screen bg-green-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
          <p className="text-green-200">Loading proposals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-950 text-white">
      {/* Header */}
      <div className="bg-green-900 border-b border-green-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-green-100">SEED Admin Dashboard</h1>
            <p className="text-green-300">Project Proposals Management</p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={handleExportAll}
              className="bg-blue-600 hover:bg-blue-500 text-white"
              disabled={proposals.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
            <Button
              onClick={onLogout}
              variant="outline"
              className="border-green-600 text-green-100 hover:bg-green-800"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-green-800 border-green-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-100">
                Total Proposals
              </CardTitle>
              <Target className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-100">{proposals.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-green-800 border-green-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-100">
                Total Budget Requested
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-100">
                ${proposals.reduce((total, proposal) => 
                  total + calculateTotalBudget(proposal.expected_expenses), 0
                ).toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-800 border-green-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-100">
                Unique Project Leads
              </CardTitle>
              <Users className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-100">
                {new Set(proposals.flatMap(p => p.leads.map(l => l.email))).size}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-800 border-green-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-100">
                This Month
              </CardTitle>
              <Calendar className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-100">
                {proposals.filter(p => {
                  const proposalDate = new Date(p.created_at!);
                  const now = new Date();
                  return proposalDate.getMonth() === now.getMonth() && 
                         proposalDate.getFullYear() === now.getFullYear();
                }).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-400" />
              <Input
                placeholder="Search proposals by lead name, email, or project description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-green-800/50 border-green-600 text-green-100 placeholder:text-green-300"
              />
            </div>
            <Badge variant="secondary" className="bg-green-700 text-green-100">
              {filteredProposals.length} of {proposals.length} proposals
            </Badge>
          </div>
        </div>

        {/* Proposals Table */}
        <div className="bg-green-800 rounded-lg border border-green-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-green-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-green-300 uppercase tracking-wider">
                    Project Lead(s)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-green-300 uppercase tracking-wider">
                    Environmental Issue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-green-300 uppercase tracking-wider">
                    Budget
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-green-300 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-green-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-green-700">
                {filteredProposals.map((proposal) => (
                  <tr key={proposal.id} className="hover:bg-green-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        {proposal.leads.map((lead, index) => (
                          <div key={index} className="text-sm">
                            <div className="font-medium text-green-100">{lead.name}</div>
                            <div className="text-green-300">{lead.email}</div>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-green-100 max-w-xs">
                        <div className="font-medium mb-1">
                          {proposal.goal.overarchingAim.substring(0, 60)}
                          {proposal.goal.overarchingAim.length > 60 && '...'}
                        </div>
                        <div className="text-green-300 text-xs">
                          {proposal.problem_statement.environmentalIssue.substring(0, 80)}
                          {proposal.problem_statement.environmentalIssue.length > 80 && '...'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-green-100">
                        ${calculateTotalBudget(proposal.expected_expenses).toLocaleString()}
                      </div>
                      <div className="text-xs text-green-300">
                        {proposal.expected_expenses.length} items
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-300">
                      {formatDate(proposal.created_at!)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button
                        onClick={() => handleViewProposal(proposal)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-500 text-white"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProposals.length === 0 && (
            <div className="text-center py-12">
              <div className="text-green-300 mb-2">
                {searchTerm ? 'No proposals match your search criteria' : 'No proposals submitted yet'}
              </div>
              {searchTerm && (
                <Button
                  onClick={() => setSearchTerm('')}
                  variant="outline"
                  size="sm"
                  className="border-green-600 text-green-100 hover:bg-green-800"
                >
                  Clear Search
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Proposal Detail Modal */}
      <ProposalDetailModal
        proposal={selectedProposal}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProposal(null);
        }}
      />
    </div>
  );
};

export default AdminPanel;