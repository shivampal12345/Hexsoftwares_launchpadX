'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, Search, Filter } from 'lucide-react';
import { User, UserRole } from '@/types';

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
  value: UserRole;
  onChange: (value: UserRole) => void;
  options: { value: UserRole; label: string }[];
  className?: string;
}) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as UserRole)}
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

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const queryClient = useQueryClient();

  const { data: users = [], isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ['admin', 'users'],
    queryFn: async () => {
      const response = await fetch('/api/admin/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      return response.json() as Promise<User[]>;
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: UserRole }) => {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, role }),
      });
      if (!response.ok) throw new Error('Failed to update user');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });

  const handleUserRoleChange = (id: string, role: UserRole) => {
    updateUserMutation.mutate({ id, role });
  };

  // Filter users based on search term
  const filteredUsers = React.useMemo(() => {
    return users.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground mb-2">Users</h1>
        <p className="text-muted-foreground">Manage all platform users and their roles</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search users by name or email..."
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

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          {usersLoading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              Loading users...
            </div>
          ) : filteredUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/30">
                  <tr className="text-left text-muted-foreground border-b border-border">
                    <th className="p-4 font-bold">User</th>
                    <th className="p-4 font-bold">Email</th>
                    <th className="p-4 font-bold">Role</th>
                    <th className="p-4 font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-muted/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-extrabold">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-foreground">{user.name}</p>
                            <p className="text-xs text-muted-foreground">User ID: {user._id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">{user.email}</td>
                      <td className="p-4">
                        <Badge variant={
                          user.role === 'admin' ? 'accent' :
                          user.role === 'founder' ? 'default' : 'muted'
                        }>
                          {user.role}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Select
                          value={user.role}
                          onChange={(newRole) => handleUserRoleChange(user._id, newRole)}
                          options={[
                            { value: 'investor', label: 'Investor' },
                            { value: 'founder', label: 'Founder' },
                            { value: 'admin', label: 'Admin' },
                          ]}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No users found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
