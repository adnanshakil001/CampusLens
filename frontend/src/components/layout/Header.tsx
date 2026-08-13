'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Search, GraduationCap, Menu, X, User, LogOut, LayoutDashboard, GitCompare, Landmark, MessageSquare, Lock, ChevronDown, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/cn';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = React.useState(false);
  const [quickSearch, setQuickSearch] = React.useState('');
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

  const handleQuickSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      router.push(`/colleges?search=${encodeURIComponent(quickSearch.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200/80 shadow-2xs font-sans">
      
      {/* ------------------------------------------------------------- */}
      {/* 1. TOP SUB-HEADER BAR (LOGO, UTILITIES, SEARCH, SIGN IN CTA)   */}
      {/* ------------------------------------------------------------- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo & University Name */}
        <Link href="/" className="flex items-center gap-3 active:scale-95 transition-transform shrink-0">
          <div className="h-10 w-10 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-sm">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-gray-900 leading-none font-sans">
              CampusLens
            </span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
              University Portal
            </span>
          </div>
        </Link>

        {/* Top Utility Nav Links & Portal Badges */}
        <div className="hidden lg:flex items-center gap-6 text-xs font-semibold text-gray-600">
          <Link href="/colleges" className="hover:text-orange-600 transition-colors">Directory</Link>
          <Link href="/compare" className="hover:text-orange-600 transition-colors">Compare</Link>
          <Link href="/predictor" className="hover:text-orange-600 transition-colors">Predictor</Link>
          <Link href="/discussions" className="hover:text-orange-600 transition-colors">Q&A Board</Link>

          <div className="h-4 w-px bg-gray-200" />

          {/* Student & Staff Portals Pill Badges */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200/70 text-gray-700 font-bold text-xs transition-colors cursor-pointer">
              <span>Current Student</span>
              <ChevronDown size={12} />
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 font-medium text-xs">
              <span>Staff</span>
              <Lock size={11} className="text-gray-400" />
            </span>
          </div>
        </div>

        {/* Quick Search Input & Primary Blue Sign In CTA Button */}
        <div className="hidden md:flex items-center gap-3">
          <form onSubmit={handleQuickSearchSubmit} className="relative">
            <Search size={15} className="absolute left-3 top-2.5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={quickSearch}
              onChange={(e) => setQuickSearch(e.target.value)}
              placeholder="Search here..."
              className="pl-9 pr-3 py-1.5 w-44 lg:w-56 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
            />
          </form>

          {/* Auth Button */}
          {status === 'loading' ? (
            <div className="h-9 w-20 bg-gray-100 animate-pulse rounded-xl" />
          ) : session ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl bg-gray-100 hover:bg-gray-200/80 transition-all focus:outline-none"
              >
                <div className="h-7 w-7 rounded-lg bg-indigo-700 flex items-center justify-center text-white text-xs font-bold shadow-xs">
                  {session.user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="text-xs font-extrabold text-gray-800 pr-1 max-w-[100px] truncate">
                  {session.user.name?.split(' ')[0]}
                </span>
                <ChevronDown size={12} className="text-gray-500" />
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl border border-gray-200 shadow-xl py-2 z-50 animate-scale-in">
                  <div className="px-4 py-2 border-b border-gray-100 mb-1">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Logged in as</p>
                    <p className="text-xs font-extrabold text-gray-900 truncate">{session.user.email}</p>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-700 hover:text-indigo-700 hover:bg-indigo-50 transition-colors"
                  >
                    <LayoutDashboard size={15} />
                    My Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      signOut({ callbackUrl: '/' });
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100 mt-1 text-left cursor-pointer"
                  >
                    <LogOut size={15} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/auth/login">
              <button className="px-4 py-2 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer">
                <span>Log in</span>
                <ArrowUpRight size={14} />
              </button>
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Menu Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. BOTTOM MAIN CATEGORY NAVIGATION BAR (UNIVERSITY PORTAL)    */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-gray-50/90 border-t border-gray-200/60 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-11 flex items-center gap-7 text-xs font-extrabold text-gray-700">
          <Link
            href="/colleges"
            className={cn('flex items-center gap-1 hover:text-orange-600 transition-colors py-2', pathname === '/colleges' && 'text-orange-600')}
          >
            <span>About Colleges</span>
            <ChevronDown size={12} className="text-gray-400" />
          </Link>

          <Link
            href="/colleges?type=Government"
            className="flex items-center gap-1 hover:text-orange-600 transition-colors py-2"
          >
            <span>Government IITs/NITs</span>
            <ChevronDown size={12} className="text-gray-400" />
          </Link>

          <Link
            href="/compare"
            className={cn('flex items-center gap-1 hover:text-orange-600 transition-colors py-2', pathname === '/compare' && 'text-orange-600')}
          >
            <span>Compare Matrix</span>
            <ChevronDown size={12} className="text-gray-400" />
          </Link>

          <Link
            href="/predictor"
            className={cn('flex items-center gap-1 hover:text-orange-600 transition-colors py-2', pathname === '/predictor' && 'text-orange-600')}
          >
            <span>Admission Predictor</span>
            <ChevronDown size={12} className="text-gray-400" />
          </Link>

          <Link
            href="/discussions"
            className={cn('flex items-center gap-1 hover:text-orange-600 transition-colors py-2', pathname === '/discussions' && 'text-orange-600')}
          >
            <span>Student Discussions</span>
            <ChevronDown size={12} className="text-gray-400" />
          </Link>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 py-6 flex flex-col gap-4 shadow-xl animate-fade-in">
          <div className="flex flex-col gap-1 text-sm font-bold text-gray-800">
            <Link href="/colleges" onClick={() => setIsMobileMenuOpen(false)} className="p-2.5 rounded-lg hover:bg-gray-100">
              Colleges Directory
            </Link>
            <Link href="/compare" onClick={() => setIsMobileMenuOpen(false)} className="p-2.5 rounded-lg hover:bg-gray-100">
              Compare Matrix
            </Link>
            <Link href="/predictor" onClick={() => setIsMobileMenuOpen(false)} className="p-2.5 rounded-lg hover:bg-gray-100">
              Admission Predictor
            </Link>
            <Link href="/discussions" onClick={() => setIsMobileMenuOpen(false)} className="p-2.5 rounded-lg hover:bg-gray-100">
              Q&A Discussion Board
            </Link>
          </div>

          <div className="pt-2 border-t border-gray-100">
            <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
              <button className="w-full py-2.5 rounded-xl bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-1">
                <span>Log in</span>
                <ArrowUpRight size={14} />
              </button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

