'use client';

import * as React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useColleges, CollegeFilters as FilterType } from '@/hooks/useColleges';
import { CollegeSearch } from '@/components/colleges/CollegeSearch';
import { CollegeFilters } from '@/components/colleges/CollegeFilters';
import { CollegeGrid } from '@/components/colleges/CollegeGrid';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { GitCompare, Landmark, Heart, Trash2, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function CollegesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Selected state for comparison and saving
  const [compareIds, setCompareIds] = React.useState<number[]>([]);
  const [savedIds, setSavedIds] = React.useState<number[]>([]);

  // Parse filters from URL
  const filters: FilterType = React.useMemo(() => {
    return {
      search: searchParams.get('search') || undefined,
      state: searchParams.get('state') || undefined,
      type: searchParams.get('type') || undefined,
      minFees: searchParams.get('minFees') ? Number(searchParams.get('minFees')) : undefined,
      maxFees: searchParams.get('maxFees') ? Number(searchParams.get('maxFees')) : undefined,
      minRating: searchParams.get('minRating') ? Number(searchParams.get('minRating')) : undefined,
      exam: searchParams.get('exam') || undefined,
      rank: searchParams.get('rank') ? Number(searchParams.get('rank')) : undefined,
    };
  }, [searchParams]);

  // Fetch colleges using React Query hook
  const { data: colleges, isLoading, error } = useColleges(filters);

  // Sync state changes with URL query parameters
  const updateUrlFilters = (newFilters: FilterType) => {
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, val]) => {
      if (val !== undefined && val !== '') {
        params.set(key, String(val));
      }
    });
    router.push(`/colleges?${params.toString()}`);
  };

  const handleClearFilters = () => {
    router.push('/colleges');
  };

  const handleCompareToggle = (id: number) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 3) {
        alert('You can compare a maximum of 3 colleges side-by-side.');
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleSaveToggle = (id: number) => {
    setSavedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      return [...prev, id];
    });
  };

  // Find college details for current comparisons
  const compareColleges = React.useMemo(() => {
    if (!colleges) return [];
    return colleges.filter((c) => compareIds.includes(c.id));
  }, [compareIds, colleges]);

  return (
    <div className="flex-grow bg-[#fcf9f8] py-12 relative min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
        
        {/* Title Heading */}
        <div className="flex flex-col gap-2.5">
          <span className="text-sm font-extrabold uppercase tracking-widest text-secondary">
            Discovery Engine
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-on-surface font-sans">
            Explore Premium Colleges in India
          </h1>
          <p className="text-base text-on-surface-variant font-semibold max-w-2xl">
            Search, filter, and compare top-tier universities. Input your exam rank scores to predict matches instantly.
          </p>
        </div>

        {/* Global Search Bar */}
        <CollegeSearch
          value={filters.search || ''}
          onChange={(val) => updateUrlFilters({ ...filters, search: val })}
        />

        {/* Main Grid & Filters Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <CollegeFilters
              filters={filters}
              onChange={updateUrlFilters}
              onClear={handleClearFilters}
            />
          </div>

          {/* Results Grid */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            {isLoading ? (
              // Skeleton cards list
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx} className="bg-surface rounded-xl border border-border-subtle p-5 flex flex-col gap-4 h-[380px]">
                    <Skeleton className="h-40 w-full rounded-lg" />
                    <Skeleton className="h-6 w-3/4 rounded" variant="text" />
                    <Skeleton className="h-4 w-1/2 rounded" variant="text" />
                    <div className="grid grid-cols-2 gap-4 mt-auto">
                      <Skeleton className="h-10 w-full rounded" />
                      <Skeleton className="h-10 w-full rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-white border border-border-subtle p-12 text-center rounded-xl shadow-sm flex flex-col items-center gap-4">
                <p className="text-lg font-bold text-error">Failed to load colleges</p>
                <Button variant="outline" onClick={() => router.refresh()}>Try Again</Button>
              </div>
            ) : colleges && colleges.length > 0 ? (
              <>
                <p className="text-sm font-extrabold text-on-surface-variant uppercase tracking-wider">
                  Found {colleges.length} Matching Colleges
                </p>
                <CollegeGrid
                  colleges={colleges}
                  compareIds={compareIds}
                  onCompareToggle={handleCompareToggle}
                  savedIds={savedIds}
                  onSaveToggle={handleSaveToggle}
                />
              </>
            ) : (
              // Empty search state
              <div className="bg-white border border-border-subtle p-16 text-center rounded-xl shadow-sm flex flex-col items-center gap-5">
                <Landmark size={48} className="text-outline/40" />
                <h3 className="text-xl font-bold text-on-surface">No Colleges Found</h3>
                <p className="text-sm font-semibold text-on-surface-variant max-w-sm">
                  We couldn't find any colleges matching your search query or selected filter criteria. Try relaxing your filters or searching a different term.
                </p>
                <Button variant="primary" onClick={handleClearFilters}>
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Bottom Comparison Drawer Banner */}
      {compareIds.length > 0 && (
        <div className="fixed bottom-0 inset-x-0 bg-primary/95 text-white py-4 px-6 shadow-2xl border-t border-primary-container z-40 animate-scale-in flex items-center justify-between glassmorphism">
          <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-2 rounded-lg bg-white/10 text-secondary">
                <GitCompare size={22} />
              </div>
              <div>
                <p className="text-sm font-extrabold tracking-wide">College Comparison Drawer</p>
                <p className="text-xs text-white/70 font-semibold mt-0.5">
                  Selected {compareIds.length} of 3 maximum colleges
                </p>
              </div>
              
              {/* Selected List Thumbnails */}
              <div className="hidden lg:flex items-center gap-3 ml-6">
                {compareColleges.map((col) => (
                  <div key={col.id} className="flex items-center gap-2 bg-white/10 rounded-lg py-1 px-3 border border-white/10">
                    {col.logo_url && (
                      <img src={col.logo_url} alt="" className="h-5 w-5 object-contain rounded bg-white" />
                    )}
                    <span className="text-xs font-bold truncate max-w-[120px]">{col.name}</span>
                    <button
                      onClick={() => handleCompareToggle(col.id)}
                      className="text-white/50 hover:text-white transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => setCompareIds([])}
                className="text-white hover:bg-white/10 flex items-center gap-1.5"
              >
                <Trash2 size={16} />
                Clear
              </Button>
              <Link href={`/compare?ids=${compareIds.join(',')}`}>
                <Button variant="secondary" className="flex items-center gap-1.5">
                  <span>Compare Now</span>
                  <ChevronRight size={16} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Add simple close icon for comparison pills
const X = ({ size, className }: { size?: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size || 16} height={size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);
