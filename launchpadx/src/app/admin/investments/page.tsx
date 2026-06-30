'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Activity, Search, Filter, ArrowUpRight } from 'lucide-react';
import { Investment, Startup, User } from '@/types';

type AdminInvestment = Omit<Investment, 'userId' | 'startupId'> & {
  userId?: User | null;
  startupId?: Startup | null;
};

// Simple card component
const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`border border-border rounded-xl bg-card shadow-sm ${className}`}>{children}</div>
);

const CardContent = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

export default function AdminInvestmentsPage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const { data: investments = [], isLoading: investmentsLoading } = useQuery<AdminInvestment[]>({
    queryKey: ['admin', 'investments'],
    queryFn: async () => {
      const response = await fetch('/api/admin/investments');
      if (!response.ok) throw new Error('Failed to fetch investments');
      return response.json() as Promise<AdminInvestment[]>;
    },
  });

  // Filter investments based on search term
  const filteredInvestments = React.useMemo(() => {
    return investments.filter((investment) => {
      const userName = investment.userId?.name?.toLowerCase() || '';
      const startupName = investment.startupId?.name?.toLowerCase() || '';
      const search = searchTerm.toLowerCase();
      return userName.includes(search) || startupName.includes(search);
    });
  }, [investments, searchTerm]);

  // Calculate total investment
  const totalInvestment = React.useMemo(() => {
    return investments.reduce((sum, inv) => sum + inv.amount, 0);
  }, [investments]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground mb-2">Investments</h1>
        <p className="text-muted-foreground">View all investment transactions</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Invested</p>
                <p className="text-2xl font-extrabold text-foreground">
                  ${totalInvestment.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <ArrowUpRight className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Transactions</p>
                <p className="text-2xl font-extrabold text-foreground">
                  {investments?.length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Avg Investment</p>
                <p className="text-2xl font-extrabold text-foreground">
                  ${
                    investments && investments.length > 0
                      ? Math.round(totalInvestment / investments.length).toLocaleString()
                      : '0'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search investments by user or startup..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-muted text-muted-foreground rounded-lg font-bold hover:bg-muted/80 transition-colors">
              <Filter className="h-4 w-4" />
              Filter
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Investments Table */}
      <Card>
        <CardContent className="p-0">
          {investmentsLoading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              Loading investments...
            </div>
          ) : filteredInvestments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/30">
                  <tr className="text-left text-muted-foreground border-b border-border">
                    <th className="p-4 font-bold">Investor</th>
                    <th className="p-4 font-bold">Startup</th>
                    <th className="p-4 font-bold">Amount</th>
                    <th className="p-4 font-bold">Date</th>
                    <th className="p-4 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredInvestments.map((investment) => (
                    <tr key={investment._id} className="hover:bg-muted/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-extrabold">
                            {investment.userId?.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div>
                            <p className="font-bold text-foreground">{investment.userId?.name || 'Unknown User'}</p>
                            <p className="text-xs text-muted-foreground">{investment.userId?.email || ''}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-bold text-foreground">{investment.startupId?.name || 'Unknown Startup'}</p>
                          <p className="text-xs text-muted-foreground">{investment.startupId?.industry || ''}</p>
                        </div>
                      </td>
                      <td className="p-4 font-extrabold text-primary">
                        ${investment.amount.toLocaleString()}
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {investment.createdAt ? new Date(investment.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : 'Pending'}
                      </td>
                      <td className="p-4">
                        <span className="px-3 py-1 rounded-full text-xs font-bold border bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                          Completed
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No investments found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
