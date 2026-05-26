'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { GraduationCap, Sparkles, Search, GitCompare, Landmark, MessageSquare, ArrowRight, Award, ShieldCheck, Users } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/colleges?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/colleges');
    }
  };

  const featureLinks = [
    { href: '/colleges', label: 'Explore Directory', description: 'Search and filter colleges by locations, ratings, established history, and annual fees.', icon: Landmark, color: 'text-primary' },
    { href: '/compare', label: 'Compare side-by-side', description: 'Select 2 or 3 colleges and instantly map out side-by-side matrices highlighting best values.', icon: GitCompare, color: 'text-secondary' },
    { href: '/predictor', label: 'Rank Predictor', description: 'Calculate cutoffs matches based on caste category, state quotas, and entrance rank scores.', icon: GraduationCap, color: 'text-status-success' },
    { href: '/discussions', label: 'Community Board', description: 'Connect directly with current students and alumni to clarify admission questions.', icon: MessageSquare, color: 'text-status-info' },
  ];

  return (
    <div className="flex-grow flex flex-col bg-[#fcf9f8] min-h-screen">
      
      {/* Hero Section Banner */}
      <section className="relative bg-primary text-white overflow-hidden py-24 sm:py-32 flex flex-col items-center">
        {/* Cover graphic overlapping background */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&q=80')] bg-cover bg-center opacity-10 filter blur-xs" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/50 to-primary" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center gap-6 z-10">
          
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-extrabold text-secondary tracking-widest uppercase border border-white/10 shadow-sm">
            <Sparkles size={12} className="animate-spin" />
            Empowering Higher Education Choices
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none font-sans text-white max-w-4xl">
            Discover Your Perfect University Campus
          </h1>

          <p className="text-base sm:text-lg text-white/80 max-w-2xl font-semibold leading-relaxed">
            CampusLens is a premium, data-driven college matching directory helping Indian students compare placement matrices, evaluate tuition fees, and predict seat cutoffs.
          </p>

          {/* Centered Search Console */}
          <form
            onSubmit={handleSearchSubmit}
            className="w-full max-w-2xl flex items-center bg-white rounded-2xl shadow-2xl p-2 mt-6 border border-white/20 transition-all duration-300 focus-within:ring-4 focus-within:ring-white/10"
          >
            <div className="pl-4 text-outline shrink-0">
              <Search size={20} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by college name e.g. IIT Bombay, NIT Trichy, city, state..."
              className="flex-grow pl-3 pr-4 py-3 bg-transparent text-sm font-semibold text-on-surface placeholder:text-outline/70 outline-none border-none"
            />
            <Button variant="primary" type="submit" className="shrink-0 flex items-center gap-1">
              <span>Find Colleges</span>
              <ArrowRight size={14} />
            </Button>
          </form>

        </div>
      </section>

      {/* Statistics counters bar section */}
      <section className="relative -mt-8 z-20 max-w-5xl mx-auto w-full px-4 sm:px-6">
        <div className="bg-white border border-border-subtle rounded-2xl shadow-xl py-6 px-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-3xl font-extrabold text-primary">80+ Premium</p>
            <p className="text-xs font-bold text-outline uppercase tracking-wider mt-1">Colleges & Universities</p>
          </div>
          <div className="border-t sm:border-t-0 sm:border-l sm:border-r border-border-subtle py-4 sm:py-0">
            <p className="text-3xl font-extrabold text-secondary">₹1.6 Crore</p>
            <p className="text-xs font-bold text-outline uppercase tracking-wider mt-1">Highest Salary Seeded</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-status-success">100% Free</p>
            <p className="text-xs font-bold text-outline uppercase tracking-wider mt-1">Decision Matching Tools</p>
          </div>
        </div>
      </section>

      {/* Core Matching Tools grid list */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col gap-12 w-full">
        
        <div className="text-center flex flex-col gap-2">
          <span className="text-xs font-extrabold text-secondary uppercase tracking-widest">Core Engine</span>
          <h2 className="text-3xl font-extrabold tracking-tight text-on-surface font-sans">
            Interactive Decision Selection Tools
          </h2>
          <p className="text-sm font-semibold text-on-surface-variant max-w-md mx-auto">
            Leverage custom calculators, matching algorithms, side-by-side matrices, and student Q&A boards to guide your higher education decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featureLinks.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <Card
                key={idx}
                className="bg-white border-border-subtle p-6 rounded-xl shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="flex flex-col gap-4">
                  <div className={`p-3 rounded-xl bg-surface-muted inline-block w-fit ${feat.color}`}>
                    <Icon size={22} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-on-surface group-hover:text-primary transition-colors">
                      {feat.label}
                    </h3>
                    <p className="text-xs font-semibold text-on-surface-variant mt-2 leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                </div>

                <Link href={feat.href} className="mt-6 flex items-center gap-1 text-xs font-extrabold text-secondary hover:text-secondary-container transition-colors">
                  <span>Open Tool</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </Card>
            );
          })}
        </div>

      </section>

      {/* Platform Trust Info Section */}
      <section className="bg-white border-t border-b border-border-subtle py-16 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/5 rounded-xl text-primary shrink-0">
              <Award size={24} />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-on-surface">Official NIRF Ratings</h4>
              <p className="text-xs font-semibold text-on-surface-variant leading-relaxed mt-1.5">
                Our catalog lists accurate engineering rank scores matched against the national institutional ranking framework of India.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-secondary/5 rounded-xl text-secondary shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-on-surface">Verified Student Reviews</h4>
              <p className="text-xs font-semibold text-on-surface-variant leading-relaxed mt-1.5">
                Read direct alumni placements reports and reviews from verified university logins.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-status-success/5 rounded-xl text-status-success shrink-0">
              <Users size={24} />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-on-surface">Active Student Community</h4>
              <p className="text-xs font-semibold text-on-surface-variant leading-relaxed mt-1.5">
                Ask specific caste categories questions, JEE score brackets, home state cutoff requirements on our public discussion board.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
