'use client';

import * as React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCompareColleges, ComparisonCollege } from '@/hooks/useCompare';
import { CompareTable } from '@/components/compare/CompareTable';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Modal } from '@/components/ui/Modal';
import { GitCompare, Plus, ArrowLeft, Trash2, Landmark, Search, Check, Sparkles, Trophy } from 'lucide-react';
import Link from 'next/link';

// Available colleges library for manual adding / picker
const ALL_SELECTABLE_COLLEGES: ComparisonCollege[] = [
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
  {
    id: 4,
    name: 'International Institute of Information Technology (IIIT Hyderabad)',
    slug: 'iiit-hyderabad',
    location: 'Hyderabad, Telangana',
    state: 'Telangana',
    city: 'Hyderabad',
    type: 'Private',
    established: 1998,
    rating: 4.8,
    fees: 360000,
    ranking: 55,
    cover_url: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80',
    logo_url: '',
    coursesCount: 8,
    latestPlacement: {
      id: 4,
      college_id: 4,
      year: 2024,
      highest_package: 102,
      average_package: 30.0,
      placement_percentage: 98.0,
    },
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
    cover_url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80',
    logo_url: '',
    coursesCount: 15,
    latestPlacement: {
      id: 5,
      college_id: 5,
      year: 2024,
      highest_package: 82,
      average_package: 17.5,
      placement_percentage: 88.0,
    },
  },
  {
    id: 6,
    name: 'College of Engineering Pune (COEP)',
    slug: 'coep-pune',
    location: 'Pune, Maharashtra',
    state: 'Maharashtra',
    city: 'Pune',
    type: 'Government',
    established: 1854,
    rating: 4.5,
    fees: 135000,
    ranking: 73,
    cover_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
    logo_url: '',
    coursesCount: 11,
    latestPlacement: {
      id: 6,
      college_id: 6,
      year: 2024,
      highest_package: 50,
      average_package: 11.5,
      placement_percentage: 86.0,
    },
  },
];

function CompareContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  // Read college IDs from search params (EMPTY by default!)
  const collegeIds = React.useMemo(() => {
    const idsStr = searchParams.get('ids');
    if (!idsStr || idsStr.trim() === '') return []; // Start empty by default!
    return idsStr
      .split(',')
      .map((id) => Number(id.trim()))
      .filter((id) => !isNaN(id));
  }, [searchParams]);

  // Fetch comparison data using React Query (0 network latency when empty)
  const { data: apiColleges, isLoading } = useCompareColleges(collegeIds);

  // Compute final colleges list for comparison
  const displayColleges = React.useMemo(() => {
    if (collegeIds.length === 0) return [];
    if (apiColleges && apiColleges.length > 0) return apiColleges;
    // Filter fallback list to requested IDs
    return ALL_SELECTABLE_COLLEGES.filter((c) => collegeIds.includes(c.id));
  }, [apiColleges, collegeIds]);

  const handleAddCollege = (id: number) => {
    if (collegeIds.includes(id)) return;
    if (collegeIds.length >= 3) return;
    const updatedIds = [...collegeIds, id];
    router.push(`/compare?ids=${updatedIds.join(',')}`);
    setIsAddModalOpen(false);
  };

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

  const filteredPickerColleges = React.useMemo(() => {
    return ALL_SELECTABLE_COLLEGES.filter((col) =>
      col.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      col.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      col.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

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
            <div className="flex items-center gap-2">
              {displayColleges.length < 3 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddModalOpen(true)}
                  className="border-orange-200 text-orange-600 hover:bg-orange-50 rounded-xl flex items-center gap-1.5 active:scale-95"
                >
                  <Plus size={14} />
                  <span>Add University</span>
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                className="text-red-600 border-gray-200 hover:bg-red-50 hover:border-red-200 rounded-xl flex items-center gap-1.5 active:scale-95"
                onClick={handleClearAll}
              >
                <Trash2 size={14} />
                <span>Clear Matrix</span>
              </Button>
            </div>
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
            Select up to 3 colleges to compare tuition fee structures, NIRF national ranks, average CTC placement offers, and degree programs.
          </p>
        </div>

        {/* Dynamic comparison states */}
        {isLoading ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 flex flex-col gap-4 shadow-sm animate-pulse">
            <Skeleton className="h-24 w-full rounded-xl bg-gray-200" />
            <Skeleton className="h-12 w-full rounded-lg bg-gray-200" />
            <Skeleton className="h-12 w-full rounded-lg bg-gray-200" />
          </div>
        ) : displayColleges.length > 0 ? (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">
                Comparing {displayColleges.length} of 3 Maximum Universities
              </p>
              
              <div className="flex items-center gap-3">
                {displayColleges.length < 3 && (
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-orange-600 text-white text-xs font-bold hover:bg-orange-700 active:scale-95 transition-all cursor-pointer shadow-xs"
                  >
                    <Plus size={13} />
                    <span>Add {3 - displayColleges.length} More</span>
                  </button>
                )}

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold w-fit">
                  <Trophy size={13} className="text-emerald-600" />
                  <span>Green highlights indicate top category performance</span>
                </div>
              </div>
            </div>
            
            {/* Matrices Table Grid */}
            <CompareTable colleges={displayColleges} onRemove={handleRemoveCollege} />

          </div>
        ) : (
          /* EMPTY STATE PANEL — User Selects / Adds Colleges */
          <div className="bg-white border border-gray-200/80 p-12 sm:p-16 text-center rounded-3xl shadow-xs flex flex-col items-center gap-6 max-w-2xl mx-auto w-full">
            <div className="h-20 w-20 rounded-3xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 shadow-inner">
              <GitCompare size={38} />
            </div>

            <div className="flex flex-col gap-2 max-w-md">
              <h3 className="text-2xl font-extrabold text-gray-900">No Colleges Selected</h3>
              <p className="text-sm font-medium text-gray-600 leading-relaxed">
                Add up to 3 colleges side-by-side to evaluate tuition fees, NIRF ranks, and CTC placement packages.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <Button
                variant="primary"
                onClick={() => setIsAddModalOpen(true)}
                className="w-full sm:w-auto rounded-xl px-7 py-3 font-bold flex items-center justify-center gap-2 active:scale-95 shadow-md"
              >
                <Plus size={18} />
                <span>Add College to Compare</span>
              </Button>

              <Link href="/colleges" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto rounded-xl px-6 py-3 font-bold active:scale-95">
                  Browse Directory
                </Button>
              </Link>
            </div>

            {/* Quick Sample Comparisons */}
            <div className="pt-6 border-t border-gray-100 w-full flex flex-col items-center gap-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                <Sparkles size={12} className="text-orange-500" />
                Popular Quick Comparisons
              </span>
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => router.push('/compare?ids=1,2,3')}
                  className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-orange-50 hover:text-orange-700 text-xs font-bold text-gray-700 transition-all border border-gray-200/80 active:scale-95 cursor-pointer"
                >
                  IIT Bombay vs BITS Pilani vs NIT Trichy
                </button>
                <button
                  onClick={() => router.push('/compare?ids=1,4')}
                  className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-orange-50 hover:text-orange-700 text-xs font-bold text-gray-700 transition-all border border-gray-200/80 active:scale-95 cursor-pointer"
                >
                  IIT Bombay vs IIIT Hyderabad
                </button>
                <button
                  onClick={() => router.push('/compare?ids=5,6')}
                  className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-orange-50 hover:text-orange-700 text-xs font-bold text-gray-700 transition-all border border-gray-200/80 active:scale-95 cursor-pointer"
                >
                  DTU Delhi vs COEP Pune
                </button>
              </div>
            </div>

          </div>
        )}

        {/* MODAL PICKER TO ADD COLLEGES */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Select a University to Compare"
        >
          <div className="flex flex-col gap-4 py-2">
            {/* Search Input inside Modal */}
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-3.5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search college name, state, or type..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            {/* List of Selectable Colleges */}
            <div className="flex flex-col gap-2 max-h-[350px] overflow-y-auto pr-1">
              {filteredPickerColleges.map((col) => {
                const isSelected = collegeIds.includes(col.id);
                return (
                  <div
                    key={col.id}
                    onClick={() => !isSelected && handleAddCollege(col.id)}
                    className={`p-3 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-gray-50 border-gray-200 opacity-60 pointer-events-none'
                        : 'bg-white border-gray-200 hover:border-orange-400 hover:bg-orange-50/50 active:scale-[0.99]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-gray-100 rounded-lg p-1 border border-gray-200 flex items-center justify-center shrink-0">
                        {col.logo_url ? (
                          <img src={col.logo_url} alt="" className="h-full w-full object-contain rounded" />
                        ) : (
                          <Landmark size={20} className="text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h5 className="text-sm font-bold text-gray-900 leading-snug">{col.name}</h5>
                        <p className="text-xs text-gray-500">{col.location} • NIRF #{col.ranking || 'N/A'}</p>
                      </div>
                    </div>

                    <div>
                      {isSelected ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                          <Check size={14} /> Added
                        </span>
                      ) : (
                        <span className="text-xs font-extrabold text-orange-600 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-lg border border-orange-200 transition-colors">
                          + Add
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Modal>

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


