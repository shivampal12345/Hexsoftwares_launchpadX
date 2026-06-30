'use client';

import * as React from 'react';
import Link from 'next/link';
import { ChevronDown, LogOut, Wallet, Shield, Rocket } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '../ui/Badge';
import { User, UserRole } from '@/types';

interface UserMenuProps {
  user: User;
  onLogout: () => void;
  onLaunchCampaign?: () => void;
  onNavigate?: () => void;
  variant?: 'desktop' | 'mobile';
}

function getRoleBadgeVariant(role: UserRole) {
  if (role === 'admin') return 'accent' as const;
  if (role === 'founder') return 'primary' as const;
  return 'muted' as const;
}

function formatRole(role: UserRole) {
  return role.charAt(0).toUpperCase() + role.slice(1);
}

export function UserMenu({
  user,
  onLogout,
  onLaunchCampaign,
  onNavigate,
  variant = 'desktop',
}: UserMenuProps) {
  const [open, setOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const canLaunchCampaign = user.role === 'founder' || user.role === 'admin';
  const isAdmin = user.role === 'admin';

  React.useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  const closeMenu = () => setOpen(false);

  const handleNavigate = () => {
    closeMenu();
    onNavigate?.();
  };

  const handleLogout = () => {
    closeMenu();
    onNavigate?.();
    onLogout();
  };

  const handleLaunchCampaign = () => {
    closeMenu();
    onNavigate?.();
    onLaunchCampaign?.();
  };

  const menuItems = (
    <div className="py-1">
      <Link
        href="/dashboard"
        onClick={handleNavigate}
        className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
      >
        <Wallet className="h-4 w-4 shrink-0" />
        Dashboard
      </Link>

      {isAdmin && (
        <Link
          href="/admin"
          onClick={handleNavigate}
          className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
        >
          <Shield className="h-4 w-4 shrink-0" />
          Admin Panel
        </Link>
      )}

      {canLaunchCampaign && onLaunchCampaign && (
        <button
          type="button"
          onClick={handleLaunchCampaign}
          className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
        >
          <Rocket className="h-4 w-4 shrink-0" />
          Launch Campaign
        </button>
      )}

      <div className="my-1 border-t border-border" />

      <button
        type="button"
        onClick={handleLogout}
        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-500/10 transition-colors cursor-pointer"
      >
        <LogOut className="h-4 w-4 shrink-0" />
        Logout
      </button>
    </div>
  );

  const userDetails = (
    <div className="border-b border-border px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-extrabold text-primary">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-foreground">{user.name}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        </div>
      </div>
      <div className="mt-2.5">
        <Badge variant={getRoleBadgeVariant(user.role)}>{formatRole(user.role)}</Badge>
      </div>
    </div>
  );

  if (variant === 'mobile') {
    return (
      <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-base font-extrabold text-primary">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-foreground">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            <div className="mt-1.5">
              <Badge variant={getRoleBadgeVariant(user.role)}>{formatRole(user.role)}</Badge>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-1">
          <Link href="/dashboard" onClick={handleNavigate}>
            <span className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary">
              <Wallet className="h-4 w-4" />
              Dashboard
            </span>
          </Link>

          {isAdmin && (
            <Link href="/admin" onClick={handleNavigate}>
              <span className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary">
                <Shield className="h-4 w-4" />
                Admin Panel
              </span>
            </Link>
          )}

          {canLaunchCampaign && onLaunchCampaign && (
            <button
              type="button"
              onClick={handleLaunchCampaign}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary cursor-pointer"
            >
              <Rocket className="h-4 w-4" />
              Launch Campaign
            </button>
          )}

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-500/10 cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2 rounded-xl border border-border bg-muted px-2.5 py-1.5 text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/10 hover:shadow-sm cursor-pointer"
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-extrabold text-primary">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="hidden lg:block text-left min-w-0 max-w-[140px]">
          <p className="truncate text-sm font-semibold leading-tight">{user.name}</p>
          <p className="truncate text-[11px] text-muted-foreground leading-tight">{formatRole(user.role)}</p>
        </div>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-[calc(100%+8px)] z-50 w-64 overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-lg"
            role="menu"
          >
            {userDetails}
            {menuItems}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
