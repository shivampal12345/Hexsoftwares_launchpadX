'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  Users,
  BriefcaseBusiness,
  CircleDollarSign,
  ShieldCheck,
  TrendingUp,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { Investment, Startup, User } from '@/types';

type AdminInvestment = Omit<Investment, 'userId' | 'startupId'> & {
  userId?: User | null;
  startupId?: Startup | null;
};

// Simple card component
const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`border border-border rounded-xl bg-card shadow-sm ${className}`}>{children}</div>
);

const CardHeader = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-4 border-b border-border ${className}`}>{children}</div>
);

const CardTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <h3 className={`text-lg font-bold ${className}`}>{children}</h3>
);

const CardContent = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

export default function AdminDashboardPage() {
  const { data: users = [], isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ['admin', 'users'],
    queryFn: async () => {
      const response = await fetch('/api/admin/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      return response.json() as Promise<User[]>;
    },
  });

  const { data: startups = [], isLoading: startupsLoading } = useQuery<Startup[]>({
    queryKey: ['admin', 'startups'],
    queryFn: async () => {
      const response = await fetch('/api/admin/startups');
      if (!response.ok) throw new Error('Failed to fetch startups');
      return response.json() as Promise<Startup[]>;
    },
  });

  const { data: investments = [], isLoading: investmentsLoading } = useQuery<AdminInvestment[]>({
    queryKey: ['admin', 'investments'],
    queryFn: async () => {
      const response = await fetch('/api/admin/investments');
      if (!response.ok) throw new Error('Failed to fetch investments');
      return response.json() as Promise<AdminInvestment[]>;
    },
  });

  // Calculate statistics
  const totalInvestment = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const fundedStartups = startups.filter((s) => s.amountRaised >= s.fundingGoal).length;
  const activeStartups = startups.filter((s) => s.status === 'active').length;
  const totalUsers = users.length;
  const founders = users.filter((u) => u.role === 'founder').length;
  const investors = users.filter((u) => u.role === 'investor').length;
  const adminCount = users.filter((u) => u.role === 'admin').length;

  // Get recent activity
  const recentInvestments = investments?.slice(0, 5) || [];
  const recentStartups = startups?.slice(0, 3) || [];

  const quickStats = [
    {
      name: 'Total Users',
      value: totalUsers,
      icon: Users,
      href: '/admin/users',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-500/10',
      detail: `${founders} Founders, ${investors} Investors`,
      trend: '+12% this month',
    },
    {
      name: 'Total Startups',
      value: startups.length,
      icon: BriefcaseBusiness,
      href: '/admin/startups',
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-500/10',
      detail: `${activeStartups} Active, ${fundedStartups} Funded`,
      trend: '+8% this month',
    },
    {
      name: 'Total Investment',
      value: `$${totalInvestment.toLocaleString()}`,
      icon: CircleDollarSign,
      href: '/admin/investments',
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      detail: `${investments.length} Transactions`,
      trend: '+24% this month',
    },
    {
      name: 'Funded Startups',
      value: fundedStartups,
      icon: ShieldCheck,
      href: '/admin/startups',
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-500/10',
      detail: 'Successfully funded',
      trend: '+3 this week',
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here&apos;s what&apos;s happening with your platform.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat) => (
          <Link key={stat.name} href={stat.href}>
            <Card className="hover:bg-muted/50 transition-all cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bgColor} ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div className="flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {stat.trend}
                  </div>
                </div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  {stat.name}
                </p>
                <p className="text-2xl font-extrabold text-foreground mb-2">
                  {usersLoading || startupsLoading || investmentsLoading ? '...' : stat.value}
                </p>
                <p className="text-xs text-muted-foreground">{stat.detail}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Investments */}
          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Investments
              </CardTitle>
              <Link href="/admin/investments" className="text-sm font-bold text-primary hover:underline">
                View All
              </Link>
            </CardHeader>
            <CardContent>
              {investmentsLoading ? (
                <div className="flex items-center justify-center py-8 text-muted-foreground">
                  Loading...
                </div>
              ) : recentInvestments.length > 0 ? (
                <div className="space-y-3">
                  {recentInvestments.map((investment, index) => (
                    <div key={investment._id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-bold text-foreground">
                            {investment.userId?.name || 'Unknown User'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            invested in {investment.startupId?.name || 'Unknown Startup'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-extrabold text-primary">
                          ${investment.amount?.toLocaleString() || '0'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {investment.createdAt ? new Date(investment.createdAt).toLocaleDateString() : 'Pending'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No investments yet
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Startups */}
          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BriefcaseBusiness className="h-5 w-5" />
                Recent Startups
              </CardTitle>
              <Link href="/admin/startups" className="text-sm font-bold text-primary hover:underline">
                View All
              </Link>
            </CardHeader>
            <CardContent>
              {startupsLoading ? (
                <div className="flex items-center justify-center py-8 text-muted-foreground">
                  Loading...
                </div>
              ) : recentStartups.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {recentStartups.map((startup) => (
                    <div
                      key={startup._id}
                      className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-bold text-foreground truncate">{startup.name}</h4>
                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                          startup.status === 'active'
                            ? 'bg-primary/10 text-primary'
                            : startup.status === 'funded'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : startup.status === 'draft'
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {startup.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{startup.tagline}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{startup.industry}</span>
                        <span className="font-bold text-primary">${startup.amountRaised?.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No startups yet
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* User Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              {usersLoading ? (
                <div className="flex items-center justify-center py-8 text-muted-foreground">
                  Loading...
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Admins</span>
                      <span className="font-bold text-foreground">{adminCount}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${totalUsers > 0 ? (adminCount / totalUsers) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Founders</span>
                      <span className="font-bold text-foreground">{founders}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-purple-500 transition-all"
                        style={{ width: `${totalUsers > 0 ? (founders / totalUsers) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Investors</span>
                      <span className="font-bold text-foreground">{investors}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 transition-all"
                        style={{ width: `${totalUsers > 0 ? (investors / totalUsers) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin/users" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-foreground">Manage Users</p>
                  <p className="text-xs text-muted-foreground">View and edit user roles</p>
                </div>
              </Link>

              <Link href="/admin/startups" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  <BriefcaseBusiness className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-foreground">Manage Startups</p>
                  <p className="text-xs text-muted-foreground">Review and update startup status</p>
                </div>
              </Link>

              <Link href="/admin/investments" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-foreground">View Investments</p>
                  <p className="text-xs text-muted-foreground">Monitor investment activity</p>
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
