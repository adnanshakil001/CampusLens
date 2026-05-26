'use client';

import * as React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCompareColleges } from '@/hooks/useCompare';
import { CompareTable } from '@/components/compare/CompareTable';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { GitCompare, Plus, ArrowLeft, Trash2, Landmark } from 'lucide-react';
import Link from 'next/link';

export default function ComparePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read college IDs from search params
  const collegeIds = React.useMemo(() => {
    const idsStr = searchParams.get('ids');
    if (!idsStr) return [];
    return idsStr
      .split(',')
      .map((id) => Number(id.trim()))
      .filter((id) => !isNaN(id));
  }, [searchParams]);

  // Fetch comparison data using React Query
  const { data: colleges, isLoading, error } = useCompareColleges(collegeIds);

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
    <div className="flex-grow bg-[#fcf9f8] py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
        
        {/* Breadcrumb back navigation link */}
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/colleges"
            className="inline-flex items-center gap-2 text-xs font-bold text-outline hover:text-primary transition-colors active:scale-95"
          >
            <ArrowLeft size={14} />
            Back to Directory
          </Link>

          {collegeIds.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="text-error border-border-subtle hover:bg-error/5 hover:border-error/20 flex items-center gap-1.5"
              onClick={handleClearAll}
            >
              <Trash2 size={14} />
              Clear Matrix
            </Button>
          )}
        </div>

        {/* Title details heading */}
        <div className="flex flex-col gap-2">
          <span className="text-sm font-extrabold uppercase tracking-widest text-secondary flex items-center gap-1">
            <GitCompare size={14} />
            Side-By-Side Comparison
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-on-surface font-sans">
            College Comparison Matrix
          </h1>
          <p className="text-sm font-semibold text-on-surface-variant max-w-xl">
            Analyze admission requirements, established legacies, NIRF ranks, annual tuition fees, and recent average placements.
          </p>
        </div>

        {/* Dynamic comparison states */}
        {isLoading ? (
          <div className="bg-white rounded-xl border border-border-subtle p-6 flex flex-col gap-4 shadow-sm">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-full" variant="text" />
            <Skeleton className="h-10 w-full" variant="text" />
            <Skeleton className="h-10 w-full" variant="text" />
          </div>
        ) : error ? (
          <div className="bg-white border border-border-subtle p-12 text-center rounded-xl shadow-sm">
            <p className="text-lg font-bold text-error">Failed to load comparison data</p>
            <Button variant="outline" className="mt-4" onClick={() => router.refresh()}>
              Try Again
            </Button>
          </div>
        ) : colleges && colleges.length > 0 ? (
          <div className="flex flex-col gap-6">
            <p className="text-xs font-extrabold text-on-surface-variant uppercase tracking-wider">
              Comparing {colleges.length} of 3 Maximum Universities
            </p>
            
            {/* Matrices Table Grid */}
            <CompareTable colleges={colleges} onRemove={handleRemoveCollege} />

            {/* Quick note on winners */}
            <div className="p-4 bg-status-success/5 border border-status-success/10 rounded-xl">
              <p className="text-xs font-semibold text-status-success leading-relaxed">
                💡 <strong>Matrix Highlights:</strong> Green-tinted cells highlight winning rows e.g. lowest tuition fee, highest average packages, or best national rank scores.
              </p>
            </div>
          </div>
        ) : (
          // Empty State Comparison Panel
          <div className="bg-white border border-border-subtle p-16 text-center rounded-xl shadow-sm flex flex-col items-center gap-5 max-w-2xl mx-auto w-full">
            <GitCompare size={48} className="text-outline/40 animate-bounce" />
            <h3 className="text-xl font-bold text-on-surface">No Colleges Selected</h3>
            <p className="text-sm font-semibold text-on-surface-variant">
              You haven't selected any colleges to compare. Head over to the main directory to select up to 3 colleges side-by-side.
            </p>
            <Link href="/colleges">
              <Button variant="primary" className="flex items-center gap-1">
                <span>Browse Colleges</span>
                <Plus size={16} />
              </Button>
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
