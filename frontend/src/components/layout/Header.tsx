'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Search, GraduationCap, Menu, X, User, LogOut, LayoutDashboard, GitCompare, Landmark, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { href: '/colleges', label: 'Colleges', icon: Landmark },
    { href: '/compare', label: 'Compare', icon: GitCompare },
    { href: '/predictor', label: 'Predictor', icon: GraduationCap },
    { href: '/discussions', label: 'Q&A Board', icon: MessageSquare },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glassmorphism border-b border-border-subtle h-20">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 active:scale-95 transition-transform">
          <GraduationCap className="h-9 w-9 text-primary animate-pulse" />
          <span className="text-2xl font-bold tracking-tight text-gradient font-sans">
            CampusLens
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-1.5 text-sm font-semibold transition-colors duration-200 py-2 hover:text-primary border-b-2 border-transparent',
                  isActive
                    ? 'text-primary border-primary'
                    : 'text-on-surface-variant hover:border-border-subtle/50'
                )}
              >
                <Icon size={16} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Auth / Profile Actions */}
        <div className="hidden md:flex items-center gap-4">
          {status === 'loading' ? (
            <div className="h-10 w-24 bg-surface-muted animate-pulse rounded-lg" />
          ) : session ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-full bg-surface-muted hover:bg-border-subtle transition-all duration-200 focus:outline-none"
              >
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold shadow-sm">
                  {session.user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="text-sm font-semibold text-on-surface pr-2 max-w-[120px] truncate">
                  {session.user.name?.split(' ')[0]}
                </span>
              </button>

              {/* Profile Dropdown */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-surface rounded-xl border border-border-subtle shadow-xl py-2 z-50 animate-scale-in">
                  <div className="px-4 py-2 border-b border-border-subtle mb-1">
                    <p className="text-xs text-outline font-semibold uppercase tracking-wider">Signed in as</p>
                    <p className="text-sm font-bold text-on-surface truncate">{session.user.email}</p>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm font-semibold text-on-surface-variant hover:text-primary hover:bg-surface-muted transition-colors"
                  >
                    <LayoutDashboard size={18} />
                    My Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      signOut({ callbackUrl: '/' });
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm font-semibold text-error hover:bg-error/5 transition-colors border-t border-border-subtle mt-1 text-left"
                  >
                    <LogOut size={18} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button variant="primary" size="sm">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Menu Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-on-surface-variant hover:text-primary rounded-lg hover:bg-surface-muted transition-colors focus:outline-none"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-20 bg-surface border-b border-border-subtle shadow-xl px-4 py-6 flex flex-col gap-5 z-40 animate-fade-in">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-lg text-base font-semibold text-on-surface-variant hover:text-primary hover:bg-surface-muted transition-all duration-200"
                >
                  <Icon size={20} className="text-outline" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          <hr className="border-border-subtle" />

          {/* Mobile Auth Actions */}
          <div className="flex flex-col gap-2">
            {session ? (
              <>
                <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                    <LayoutDashboard size={18} />
                    My Dashboard
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    signOut({ callbackUrl: '/' });
                  }}
                  className="w-full text-error flex items-center justify-center gap-2"
                >
                  <LogOut size={18} />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
