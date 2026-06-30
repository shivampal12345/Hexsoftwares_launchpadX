'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  BriefcaseBusiness,
  Activity,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Startups', href: '/admin/startups', icon: BriefcaseBusiness },
  { name: 'Investments', href: '/admin/investments', icon: Activity },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      if (pathname !== '/admin/login') {
        router.push('/admin/login');
      }
    }
  }, [user, authLoading, pathname, router]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // If we're on the login page, just render children without the admin layout
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (!user || user.role !== 'admin') {
    return null; // Will be handled by the useEffect redirect
  }

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow border-r border-border bg-card pt-5 pb-4">
          <div className="flex items-center flex-shrink-0 px-4">
            <div className="flex items-center space-x-2 text-primary font-extrabold text-xl tracking-wider">
              <ShieldCheck className="h-6 w-6" />
              <span>ADMIN</span>
            </div>
          </div>
          <div className="mt-8 flex-grow flex flex-col">
            <nav className="flex-1 px-2 pb-4 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      group flex items-center px-2 py-3 text-sm font-bold rounded-xl
                      ${isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }
                    `}
                  >
                    <item.icon
                      className={`
                        mr-3 h-5 w-5 flex-shrink-0
                        ${isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'}
                      `}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-border p-4">
            <div className="flex items-center">
              <div>
                <p className="text-sm font-bold text-foreground">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="ml-auto flex items-center px-3 py-2 text-sm font-bold text-muted-foreground rounded-lg hover:text-foreground hover:bg-muted"
            >
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
        <div className="flex justify-around py-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex flex-col items-center px-3 py-2 text-xs font-bold
                  ${isActive ? 'text-primary' : 'text-muted-foreground'}
                `}
              >
                <item.icon className="h-5 w-5 mb-1" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 md:ml-0 pb-20 md:pb-0">
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
