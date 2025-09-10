interface ProposalStatsProps {
  total: number;
  recent: number;
}

export function ProposalStats({ total, recent }: ProposalStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="bg-gradient-to-br from-green-800 to-green-900 p-6 rounded-xl border border-green-700">
        <h3 className="text-lg font-semibold text-green-100 mb-2">
          Total Proposals
        </h3>
        <p className="text-3xl font-bold text-green-200">
          {total}
        </p>
      </div>
      
      <div className="bg-gradient-to-br from-blue-800 to-blue-900 p-6 rounded-xl border border-blue-700">
        <h3 className="text-lg font-semibold text-blue-100 mb-2">
          Recent (30 days)
        </h3>
        <p className="text-3xl font-bold text-blue-200">
          {recent}
        </p>
      </div>
    </div>
  );
}