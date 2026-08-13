'use client';

import * as React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCompareColleges, ComparisonCollege } from '@/hooks/useCompare';
import { CompareTable } from '@/components/compare/CompareTable';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { GitCompare, Plus, ArrowLeft, Trash2, Landmark, Sparkles, Trophy, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

// Pre-loaded fallback comparison data for offline dev testing
const FALLBACK_COMPARE_COLLEGES: ComparisonCollege[] = [
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
    coursesCount: 14,
    latestPlacement: {
      id: 1,
      college_id: 1,
      year: 2024,
      highest_package: 160,
      average_package: 23.5,
      placement_percentage: 94.5,
    },
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
    coursesCount: 12,
    latestPlacement: {
      id: 2,
      college_id: 2,
      year: 2024,
      highest_package: 130,
      average_package: 20.8,
      placement_percentage: 92.0,
    },
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
    coursesCount: 10,
    latestPlacement: {
      id: 3,
      college_id: 3,
      year: 2024,
      highest_package: 52,
      average_package: 15.2,
      placement_percentage: 90.0,
    },
  },
];

function CompareContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read college IDs from search params
  const collegeIds = React.useMemo(() => {
    const idsStr = searchParams.get('ids');
    if (!idsStr) return [1, 2, 3]; // Default to IIT Bombay vs BITS Pilani vs NIT Trichy if no query params provided
    return idsStr
      .split(',')
      .map((id) => Number(id.trim()))
      .filter((id) => !isNaN(id));
  }, [searchParams]);

  // Fetch comparison data using React Query
  const { data: apiColleges, isLoading, error } = useCompareColleges(collegeIds);

  // Compute final colleges list for comparison (use API or fallback list)
  const displayColleges = React.useMemo(() => {
    if (apiColleges && apiColleges.length > 0) return apiColleges;
    // Filter fallback list to requested IDs
    const filtered = FALLBACK_COMPARE_COLLEGES.filter((c) => collegeIds.includes(c.id));
    return filtered.length > 0 ? filtered : FALLBACK_COMPARE_COLLEGES;
  }, [apiColleges, collegeIds]);

  const handleRemoveCollege = (id: number) => {
    const updatedIds = collegeIds.filter((item) => item !== id);
    if (updatedIds.length === 0) {
      router.push('/compare');
    } else {
      router.push(`/compare?ids=${updatedIds.join(',')}`);
    }
  };

  const handleClearAll = () => {
    router.push('/compare');
  };

  return (
    <div className="flex-grow bg-[#faf9f8] text-foreground py-12 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
        
        {/* Breadcrumb back navigation link & Actions */}
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/colleges"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-orange-600 transition-colors active:scale-95 cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Back to Directory</span>
          </Link>

          {displayColleges.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 border-gray-200 hover:bg-red-50 hover:border-red-200 rounded-xl flex items-center gap-1.5 active:scale-95"
              onClick={handleClearAll}
            >
              <Trash2 size={14} />
              <span>Clear Matrix</span>
            </Button>
          )}
        </div>

        {/* Title Details Heading */}
        <div className="flex flex-col gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-700 text-xs font-extrabold uppercase tracking-widest w-fit border border-orange-500/20">
            <GitCompare size={14} className="text-orange-600" />
            Side-By-Side Matrix
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
            College Comparison Engine
          </h1>
          <p className="text-sm sm:text-base text-gray-600 font-normal max-w-2xl leading-relaxed">
            Side-by-side evaluation of annual tuition fees, NIRF national ranks, average CTC placement offers, and degree programs.
          </p>
        </div>

        {/* Dynamic comparison states */}
        {isLoading ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 flex flex-col gap-4 shadow-sm animate-pulse">
            <Skeleton className="h-24 w-full rounded-xl bg-gray-200" />
            <Skeleton className="h-12 w-full rounded-lg bg-gray-200" />
            <Skeleton className="h-12 w-full rounded-lg bg-gray-200" />
            <Skeleton className="h-12 w-full rounded-lg bg-gray-200" />
          </div>
        ) : displayColleges && displayColleges.length > 0 ? (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">
                Comparing {displayColleges.length} of 3 Maximum Universities
              </p>
              
              {/* Winners Legend Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold w-fit">
                <Trophy size={13} className="text-emerald-600" />
                <span>Green highlights indicate best row performance</span>
              </div>
            </div>
            
            {/* Matrices Table Grid */}
            <CompareTable colleges={displayColleges} onRemove={handleRemoveCollege} />

          </div>
        ) : (
          // Empty State Comparison Panel
          <div className="bg-white border border-gray-200/80 p-16 text-center rounded-2xl shadow-xs flex flex-col items-center gap-5 max-w-xl mx-auto w-full">
            <GitCompare size={52} className="text-gray-300 animate-pulse" />
            <h3 className="text-xl font-extrabold text-gray-900">No Colleges Selected</h3>
            <p className="text-sm font-medium text-gray-600 leading-relaxed">
              Select up to 3 colleges from the directory to compare their fee structures, NIRF ratings, and placement CTC packages.
            </p>
            <Link href="/colleges">
              <Button variant="primary" className="rounded-xl px-6 font-bold flex items-center gap-2 active:scale-95">
                <span>Explore Directory</span>
                <Plus size={16} />
              </Button>
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <React.Suspense fallback={
      <div className="flex-grow bg-[#faf9f8] py-24 min-h-screen flex items-center justify-center">
        <div className="text-sm font-bold text-gray-500 animate-pulse">Loading Comparison Matrix...</div>
      </div>
    }>
      <CompareContent />
    </React.Suspense>
  );
}

