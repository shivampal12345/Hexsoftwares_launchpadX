'use client';

import * as React from 'react';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/components/providers/AuthProvider';
import { Loader2, User, Lock, Mail } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login, register } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [activeTab, setActiveTab] = React.useState<'login' | 'register'>('login');

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      await login(email, password);
      addToast('success', 'Successfully logged in!');
      onClose();
    } catch (err: unknown) {
      const message = getErrorMessage(err, 'Login failed');
      setError(message);
      addToast('error', message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const role = formData.get('role') as string;

    try {
      await register(name, email, password, role);
      addToast('success', 'Account created successfully!');
      onClose();
    } catch (err: unknown) {
      const message = getErrorMessage(err, 'Registration failed');
      setError(message);
      addToast('error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Welcome to LaunchPadX">
      {/* Tabs */}
      <div className="flex space-x-1 rounded-xl bg-muted p-1 border border-border mb-6">
        <button
          onClick={() => setActiveTab('login')}
          className={`relative flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'login' ? 'text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {activeTab === 'login' && (
            <div className="absolute inset-0 bg-card rounded-lg border border-border" />
          )}
          <span className="relative z-10">Login</span>
        </button>
        <button
          onClick={() => setActiveTab('register')}
          className={`relative flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'register' ? 'text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {activeTab === 'register' && (
            <div className="absolute inset-0 bg-card rounded-lg border border-border" />
          )}
          <span className="relative z-10">Sign Up</span>
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {activeTab === 'login' ? (
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                name="email"
                required
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Logging in...</>
            ) : (
              'Login'
            )}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                name="name"
                required
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                name="email"
                required
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="password"
                name="password"
                required
                minLength={6}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              I am a...
            </label>
            <select
              name="role"
              defaultValue="investor"
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            >
              <option value="investor">Investor</option>
              <option value="founder">Founder</option>
            </select>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Creating account...</>
            ) : (
              'Create Account'
            )}
          </Button>
        </form>
      )}
    </Dialog>
  );
}
