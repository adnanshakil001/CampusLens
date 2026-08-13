'use client';

import * as React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useColleges, CollegeFilters as FilterType, College } from '@/hooks/useColleges';
import { CollegeSearch } from '@/components/colleges/CollegeSearch';
import { CollegeFilters } from '@/components/colleges/CollegeFilters';
import { CollegeGrid } from '@/components/colleges/CollegeGrid';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { GitCompare, Landmark, Heart, Trash2, ChevronRight, Sparkles, FilterX } from 'lucide-react';
import Link from 'next/link';

// Rich fallback dataset for offline resilience / local dev testing
const FALLBACK_COLLEGES: College[] = [
  {
    id: 1,
    name: 'Indian Institute of Technology (IIT Bombay)',
    slug: 'iit-bombay',
    location: 'Mumbai, Maharashtra',
    state: 'Maharashtra',
    city: 'Mumbai',
    type: 'Government',
    established: 1958,
    rating: 4.9,
    fees: 220000,
    ranking: 3,
    cover_url: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80',
    logo_url: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/1d/IIT_Bombay_Logo.svg/500px-IIT_Bombay_Logo.svg.png',
    avg_package: '₹23.5 LPA',
    highest_package: '₹1.6 Cr',
  },
  {
    id: 2,
    name: 'BITS Pilani (Main Campus)',
    slug: 'bits-pilani',
    location: 'Pilani, Rajasthan',
    state: 'Rajasthan',
    city: 'Pilani',
    type: 'Private',
    established: 1964,
    rating: 4.8,
    fees: 540000,
    ranking: 25,
    cover_url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80',
    logo_url: 'https://upload.wikimedia.org/wikipedia/en/d/d3/BITS_Pilani-Logo.svg',
    avg_package: '₹20.8 LPA',
    highest_package: '₹1.3 Cr',
  },
  {
    id: 3,
    name: 'National Institute of Technology (NIT Trichy)',
    slug: 'nit-trichy',
    location: 'Tiruchirappalli, Tamil Nadu',
    state: 'Tamil Nadu',
    city: 'Tiruchirappalli',
    type: 'Government',
    established: 1964,
    rating: 4.7,
    fees: 150000,
    ranking: 9,
    cover_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
    logo_url: '',
    avg_package: '₹15.2 LPA',
    highest_package: '₹52.0 LPA',
  },
  {
    id: 4,
    name: 'International Institute of Information Technology (IIIT Hyderabad)',
    slug: 'iiit-hyderabad',
    location: 'Hyderabad, Telangana',
    state: 'Telangana',
    city: 'Hyderabad',
    type: 'Private',
    established: 1998,
    rating: 4.9,
    fees: 360000,
    ranking: 55,
    cover_url: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=800&q=80',
    logo_url: '',
    avg_package: '₹32.0 LPA',
    highest_package: '₹1.02 Cr',
  },
  {
    id: 5,
    name: 'Delhi Technological University (DTU)',
    slug: 'dtu-delhi',
    location: 'New Delhi, Delhi',
    state: 'Delhi',
    city: 'New Delhi',
    type: 'Government',
    established: 1941,
    rating: 4.6,
    fees: 219000,
    ranking: 29,
    cover_url: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&q=80',
    logo_url: '',
    avg_package: '₹17.8 LPA',
    highest_package: '₹82.0 LPA',
  },
  {
    id: 6,
    name: 'College of Engineering Pune (COEP Technological University)',
    slug: 'coep-pune',
    location: 'Pune, Maharashtra',
    state: 'Maharashtra',
    city: 'Pune',
    type: 'Government',
    established: 1854,
    rating: 4.6,
    fees: 135000,
    ranking: 72,
    cover_url: 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=80',
    logo_url: '',
    avg_package: '₹11.5 LPA',
    highest_package: '₹50.5 LPA',
  },
];

function CollegesContent() {
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
  const { data: apiColleges, isLoading, error } = useColleges(filters);

  // Compute final colleges list (using API data or filtering fallback dataset if API unreachable)
  const displayColleges = React.useMemo(() => {
    if (apiColleges && apiColleges.length > 0) return apiColleges;

    // Filter fallback list client-side for offline testing
    return FALLBACK_COLLEGES.filter((col) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matchName = col.name.toLowerCase().includes(q);
        const matchLoc = col.location.toLowerCase().includes(q);
        if (!matchName && !matchLoc) return false;
      }
      if (filters.type && col.type.toLowerCase() !== filters.type.toLowerCase()) return false;
      if (filters.state && col.state.toLowerCase() !== filters.state.toLowerCase()) return false;
      if (filters.minRating && Number(col.rating) < filters.minRating) return false;
      if (filters.minFees && col.fees < filters.minFees) return false;
      if (filters.maxFees && col.fees > filters.maxFees) return false;
      return true;
    });
  }, [apiColleges, filters]);

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
    return displayColleges.filter((c) => compareIds.includes(c.id));
  }, [compareIds, displayColleges]);

  return (
    <div className="flex-grow bg-[#faf9f8] text-foreground py-12 relative min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
        
        {/* Title Heading */}
        <div className="flex flex-col gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-700 text-xs font-extrabold uppercase tracking-widest w-fit border border-orange-500/20">
            <Sparkles size={12} className="text-orange-500" />
            Discovery Engine
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
            Explore Top Colleges in India
          </h1>
          <p className="text-sm sm:text-base text-gray-600 font-normal max-w-2xl leading-relaxed">
            Search, filter, and compare top-tier universities. Input your exam rank scores to predict cutoff matches instantly.
          </p>
        </div>

        {/* Global Search Bar */}
        <CollegeSearch
          value={filters.search || ''}
          onChange={(val) => updateUrlFilters({ ...filters, search: val })}
        />

        {/* Main Grid & Sticky Filters Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Sticky Filters Sidebar */}
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
              // Sleek Skeleton Card Grid Loading State
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div 
                    key={idx} 
                    className="bg-white rounded-2xl border border-gray-200/80 p-0 flex flex-col gap-4 overflow-hidden shadow-xs animate-pulse"
                  >
                    <Skeleton className="aspect-[16/9] w-full bg-gray-200" />
                    <div className="p-5 flex flex-col gap-3">
                      <Skeleton className="h-4 w-1/3 rounded-md bg-gray-200" />
                      <Skeleton className="h-6 w-5/6 rounded-md bg-gray-200" />
                      <Skeleton className="h-4 w-1/2 rounded-md bg-gray-200" />
                      <div className="grid grid-cols-2 gap-2 mt-4">
                        <Skeleton className="h-10 w-full rounded-xl bg-gray-200" />
                        <Skeleton className="h-10 w-full rounded-xl bg-gray-200" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : displayColleges && displayColleges.length > 0 ? (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">
                    Found {displayColleges.length} Matching Colleges
                  </p>
                </div>

                <CollegeGrid
                  colleges={displayColleges}
                  compareIds={compareIds}
                  onCompareToggle={handleCompareToggle}
                  savedIds={savedIds}
                  onSaveToggle={handleSaveToggle}
                />
              </>
            ) : (
              // Empty search state
              <div className="bg-white border border-gray-200/80 p-16 text-center rounded-2xl shadow-xs flex flex-col items-center gap-5">
                <FilterX size={52} className="text-gray-300" />
                <h3 className="text-xl font-extrabold text-gray-900">No Colleges Found</h3>
                <p className="text-sm font-medium text-gray-600 max-w-sm leading-relaxed">
                  We couldn't find any colleges matching your selected filters or search query. Try clearing your filters to see more results.
                </p>
                <Button variant="primary" className="rounded-xl px-6 font-bold" onClick={handleClearFilters}>
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Floating Bottom Comparison Drawer Banner */}
      {compareIds.length > 0 && (
        <div className="fixed bottom-0 inset-x-0 bg-gray-900/95 text-white py-4 px-6 shadow-2xl border-t border-gray-800 z-40 animate-scale-in flex items-center justify-between backdrop-blur-xl">
          <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
                <GitCompare size={22} />
              </div>
              <div>
                <p className="text-sm font-extrabold tracking-wide text-white">Side-by-Side Comparison Drawer</p>
                <p className="text-xs text-gray-400 font-medium mt-0.5">
                  Selected {compareIds.length} of 3 maximum colleges
                </p>
              </div>
              
              {/* Selected List Thumbnails */}
              <div className="hidden lg:flex items-center gap-2.5 ml-6">
                {compareColleges.map((col) => (
                  <div key={col.id} className="flex items-center gap-2 bg-white/10 rounded-xl py-1 px-3 border border-white/10">
                    <span className="text-xs font-bold truncate max-w-[130px]">{col.name}</span>
                    <button
                      onClick={() => handleCompareToggle(col.id)}
                      className="text-white/60 hover:text-white transition-colors cursor-pointer"
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => setCompareIds([])}
                className="text-gray-300 hover:text-white hover:bg-white/10 rounded-xl flex items-center gap-1.5"
              >
                <Trash2 size={16} />
                <span>Clear</span>
              </Button>
              <Link href={`/compare?ids=${compareIds.join(',')}`}>
                <Button variant="secondary" className="rounded-xl px-5 font-bold shadow-md hover:shadow-orange-500/20 flex items-center gap-1.5 active:scale-[0.97]">
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

// Simple close icon for comparison pills
const X = ({ size, className }: { size?: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size || 16} height={size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export default function CollegesPage() {
  return (
    <React.Suspense fallback={
      <div className="flex-grow bg-[#faf9f8] py-24 min-h-screen flex items-center justify-center">
        <div className="text-sm font-bold text-gray-500 animate-pulse">Loading Discovery Engine...</div>
      </div>
    }>
      <CollegesContent />
    </React.Suspense>
  );
}

