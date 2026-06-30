'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Sun, Moon, Rocket, Menu, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../providers/AuthProvider';
import { AuthModal } from '../shared/AuthModal';
import { UserMenu } from './UserMenu';

interface NavbarProps {
  onLaunchCampaign: () => void;
}

const navSpring = {
  type: 'spring' as const,
  stiffness: 180,
  damping: 20,
  mass: 0.8,
};

interface DesktopNavItemProps {
  name: string;
  href: string;
  isActive: boolean;
}

function DesktopNavItem({ name, href, isActive }: DesktopNavItemProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const [magnet, setMagnet] = React.useState({ x: 0, y: 0 });
  const isInteractive = isHovered;

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 12;

    setMagnet({
      x: Math.max(-6, Math.min(6, x)),
      y: Math.max(-6, Math.min(6, y)),
    });
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    setMagnet({ x: 0, y: 0 });
  };

  const content = (
    <motion.span
      animate={{ x: magnet.x, y: magnet.y }}
      transition={navSpring}
      className="relative inline-flex h-9 items-center justify-center rounded-xl px-3 focus:outline-none"
    >
      <AnimatePresence>
        {isInteractive && (
          <>
            <motion.span
              key="glass"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={navSpring}
              className="pointer-events-none absolute inset-0 rounded-xl border border-white/50 bg-white/70 shadow-[0_8px_30px_rgba(99,102,241,0.15)] backdrop-blur-md dark:border-white/10 dark:bg-white/10"
            />
            <motion.span
              key="glow"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 0.18, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={navSpring}
              className="pointer-events-none absolute -inset-3 rounded-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.38),rgba(124,58,237,0.16)_42%,transparent_72%)] blur-xl dark:bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.55),rgba(168,85,247,0.18)_38%,transparent_70%)]"
            />
          </>
        )}
      </AnimatePresence>

      <motion.span
        animate={{
          opacity: isInteractive || isActive ? 1 : 0.8,
          y: isInteractive ? -2 : 0,
          letterSpacing: isInteractive ? '0.4px' : '0px',
          fontWeight: isInteractive || isActive ? 650 : 600,
        }}
        transition={{ ...navSpring, duration: 0.35 }}
        className={`relative z-10 text-sm ${isActive ? 'text-primary' : 'text-foreground'}`}
      >
        {name}
      </motion.span>
    </motion.span>
  );

  const interactionProps = {
    onPointerEnter: () => setIsHovered(true),
    onPointerMove: handlePointerMove,
    onPointerLeave: handlePointerLeave,
    onFocus: () => setIsHovered(true),
    onBlur: handlePointerLeave,
    className: 'relative rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/35',
  };

  if (href.startsWith('#')) {
    return (
      <a href={href} {...interactionProps}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} {...interactionProps}>
      {content}
    </Link>
  );
}

export function Navbar({ onLaunchCampaign }: NavbarProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const [mounted, setMounted] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [authModalOpen, setAuthModalOpen] = React.useState(false);

  React.useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Startups', href: pathname === '/' ? '#startups' : '/startups' },
    { name: 'Categories', href: pathname === '/' ? '#categories' : '/#categories' },
    { name: 'How It Works', href: pathname === '/' ? '#how-it-works' : '/#how-it-works' },
    { name: 'Success Stories', href: pathname === '/' ? '#success-stories' : '/#success-stories' },
    { name: 'Insights', href: pathname === '/' ? '#insights' : '/#insights' },
  ];

  const isNavLinkActive = (href: string) => {
    const targetPath = href.split('#')[0] || '/';
    return href.startsWith('#') ? pathname === '/' : targetPath === pathname;
  };

  const getMobileNavLinkClassName = (href: string) => {
    const targetPath = href.split('#')[0] || '/';
    const isActive =
      href.startsWith('#') ? pathname === '/' : targetPath === pathname;

    return [
      'group relative rounded-xl px-3 py-2 text-base font-semibold transition-all duration-300',
      isActive
        ? 'bg-primary/10 text-primary'
        : 'text-muted-foreground hover:bg-primary/10 hover:text-primary',
    ].join(' ');
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/80 glass shadow-sm transition-all duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="group flex items-center space-x-2 text-primary font-extrabold text-xl tracking-wider transition-all duration-300 hover:-translate-y-0.5 hover:text-secondary">
          <Rocket className="h-6 w-6 stroke-[2.5]" />
          <span className="transition-transform duration-300 group-hover:scale-[1.02]">LAUNCHPAD<span className="text-accent">X</span></span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 rounded-2xl border border-border/50 bg-background/40 p-1">
          {navLinks.map((link) => (
            <DesktopNavItem
              key={link.name}
              name={link.name}
              href={link.href}
              isActive={isNavLinkActive(link.href)}
            />
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-xl bg-muted border border-border text-foreground hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/10 hover:text-primary hover:shadow-sm transition-all duration-300 cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-accent" />
              ) : (
                <Moon className="h-4 w-4 text-primary" />
              )}
            </button>
          )}

          {user ? (
            <>
              {(user.role === 'founder' || user.role === 'admin') && (
                <Button variant="outline" size="sm" onClick={onLaunchCampaign} className="font-semibold text-sm">
                  Launch Campaign
                </Button>
              )}
              <UserMenu user={user} onLogout={logout} onLaunchCampaign={onLaunchCampaign} />
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={() => setAuthModalOpen(true)} className="font-semibold text-sm">
                Login
              </Button>
              <Button variant="gradient" size="sm" onClick={() => setAuthModalOpen(true)} className="font-semibold text-sm">
                Sign Up
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center space-x-3 md:hidden">
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-xl bg-muted border border-border text-foreground transition-all duration-300 hover:border-primary/40 hover:bg-primary/10 hover:text-primary cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-accent" />
              ) : (
                <Moon className="h-4 w-4 text-primary" />
              )}
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-muted border border-border text-foreground transition-all duration-300 hover:border-primary/40 hover:bg-primary/10 hover:text-primary cursor-pointer"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-card text-card-foreground overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4 flex flex-col">
              {navLinks.map((link) =>
                link.href.startsWith('#') ? (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={getMobileNavLinkClassName(link.href)}
                  >
                    {link.name}
                  </a>
                ) : (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={getMobileNavLinkClassName(link.href)}
                  >
                    {link.name}
                  </Link>
                )
              )}
              <div className="pt-4 border-t border-border flex flex-col gap-3">
                {user ? (
                  <UserMenu
                    user={user}
                    onLogout={logout}
                    onLaunchCampaign={onLaunchCampaign}
                    onNavigate={() => setMobileMenuOpen(false)}
                    variant="mobile"
                  />
                ) : (
                  <>
                    <Button variant="outline" size="sm" onClick={() => { setMobileMenuOpen(false); setAuthModalOpen(true); }}>
                      Login
                    </Button>
                    <Button variant="gradient" size="sm" onClick={() => { setMobileMenuOpen(false); setAuthModalOpen(true); }}>
                      Sign Up
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
    <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
}
