'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BriefcaseBusiness, Search, Filter } from 'lucide-react';
import { Startup, StartupStatus } from '@/types';

// Simple card component
const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`border border-border rounded-xl bg-card shadow-sm ${className}`}>{children}</div>
);

const CardContent = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

// Badge component
const Badge = ({
  children,
  variant = 'default'
}: {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'muted' | 'outline' | 'success' | 'warning';
}) => {
  const variants = {
    default: 'bg-primary/10 text-primary border-primary/20',
    accent: 'bg-secondary/10 text-secondary border-secondary/20',
    muted: 'bg-muted text-muted-foreground border-border',
    outline: 'bg-transparent text-muted-foreground border-border',
    success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${variants[variant]}`}>
      {children}
    </span>
  );
};

// Select component
const Select = ({
  value,
  onChange,
  options,
  className
}: {
  value: StartupStatus;
  onChange: (value: StartupStatus) => void;
  options: { value: StartupStatus; label: string }[];
  className?: string;
}) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as StartupStatus)}
      className={`px-3 py-2 text-sm border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

// Progress Bar component
const ProgressBar = ({ value, max = 100 }: { value: number; max?: number }) => {
  const percentage = Math.min((value / max) * 100, 100);
  const color = percentage >= 100 ? 'bg-emerald-500' : percentage >= 50 ? 'bg-primary' : 'bg-amber-500';
  return (
    <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
      <div
        className={`h-full ${color} transition-all duration-300`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export default function AdminStartupsPage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const queryClient = useQueryClient();

  const { data: startups = [], isLoading: startupsLoading } = useQuery<Startup[]>({
    queryKey: ['admin', 'startups'],
    queryFn: async () => {
      const response = await fetch('/api/admin/startups');
      if (!response.ok) throw new Error('Failed to fetch startups');
      return response.json() as Promise<Startup[]>;
    },
  });

  const updateStartupMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: StartupStatus }) => {
      const response = await fetch('/api/admin/startups', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (!response.ok) throw new Error('Failed to update startup');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'startups'] });
    },
  });

  const handleStartupStatusChange = (id: string, status: StartupStatus) => {
    updateStartupMutation.mutate({ id, status });
  };

  // Filter startups based on search term
  const filteredStartups = React.useMemo(() => {
    return startups.filter((startup) =>
      startup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      startup.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      startup.tagline.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [startups, searchTerm]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground mb-2">Startups</h1>
        <p className="text-muted-foreground">Manage all startups and their status</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search startups by name, industry, or tagline..."
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

      {/* Startups Table */}
      <Card>
        <CardContent className="p-0">
          {startupsLoading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              Loading startups...
            </div>
          ) : filteredStartups.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/30">
                  <tr className="text-left text-muted-foreground border-b border-border">
                    <th className="p-4 font-bold">Startup</th>
                    <th className="p-4 font-bold">Industry</th>
                    <th className="p-4 font-bold">Progress</th>
                    <th className="p-4 font-bold">Status</th>
                    <th className="p-4 font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredStartups.map((startup) => {
                    const progress = Math.min((startup.amountRaised / startup.fundingGoal) * 100, 100);
                    const startupStatus = (startup.status || 'draft') as StartupStatus;
                    return (
                      <tr key={startup._id} className="hover:bg-muted/50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-extrabold text-lg">
                              {startup.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-foreground truncate">{startup.name}</p>
                              <p className="text-xs text-muted-foreground truncate">{startup.tagline}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground">{startup.industry}</td>
                        <td className="p-4">
                          <div className="w-48 space-y-1">
                            <ProgressBar
                              value={startup.amountRaised}
                              max={startup.fundingGoal}
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>${startup.amountRaised?.toLocaleString()}</span>
                              <span>${startup.fundingGoal?.toLocaleString()}</span>
                            </div>
                            <div className="text-xs font-bold text-primary">
                              {progress.toFixed(1)}%
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant={
                            startupStatus === 'active' ? 'default' :
                            startupStatus === 'funded' ? 'success' :
                            startupStatus === 'draft' ? 'warning' : 'muted'
                          }>
                            {startupStatus}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Select
                            value={startupStatus}
                            onChange={(newStatus) => handleStartupStatusChange(startup._id || '', newStatus)}
                            options={[
                              { value: 'draft', label: 'Draft' },
                              { value: 'active', label: 'Active' },
                              { value: 'funded', label: 'Funded' },
                              { value: 'closed', label: 'Closed' },
                            ]}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <BriefcaseBusiness className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No startups found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
