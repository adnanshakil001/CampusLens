'use client';

import * as React from 'react';
import { useSearchParams, useRouter, useParams } from 'next/navigation';
import {
  useCollege,
  useCollegeCourses,
  useCollegePlacements,
  useCollegeReviews,
} from '@/hooks/useCollege';
import { Tabs } from '@/components/ui/Tabs';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { StarRating } from '@/components/ui/StarRating';
import { CollegeOverview } from '@/components/colleges/CollegeOverview';
import { CollegeCourses } from '@/components/colleges/CollegeCourses';
import { CollegePlacements } from '@/components/colleges/CollegePlacements';
import { CollegeReviews } from '@/components/colleges/CollegeReviews';
import { 
  ArrowLeft, MapPin, Calendar, Award, BookOpen, Star, Building2, 
  Download, Heart, CheckCircle2, ChevronRight 
} from 'lucide-react';
import Link from 'next/link';

function CollegeDetailContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = params.slug as string;

  // Active sub-navigation tab synched with query parameter
  const activeTab = searchParams.get('tab') || 'overview';

  // Fetch all college details in parallel with cached React Query calls
  const { data: college, isLoading: isCollegeLoading, error: collegeError } = useCollege(slug);
  const { data: courses, isLoading: isCoursesLoading } = useCollegeCourses(slug);
  const { data: placements, isLoading: isPlacementsLoading } = useCollegePlacements(slug);
  const { data: reviews, isLoading: isReviewsLoading } = useCollegeReviews(slug);

  const [isSaved, setIsSaved] = React.useState(false);

  const handleTabChange = (tabId: string) => {
    router.replace(`/colleges/${slug}?tab=${tabId}`);
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'courses', label: 'Courses & Fees' },
    { id: 'placements', label: 'Placements' },
    { id: 'reviews', label: 'Reviews' },
  ];

  if (isCollegeLoading) {
    return (
      <div className="flex-grow bg-[#fcf9f8] min-h-screen">
        <Skeleton className="h-64 w-full bg-primary/20 animate-pulse" />
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 flex flex-col gap-6">
          <Skeleton className="h-10 w-80 rounded" variant="text" />
          <div className="flex gap-4 border-b border-border-subtle pb-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
            <Skeleton className="lg:col-span-8 h-[400px] rounded-lg" />
            <Skeleton className="lg:col-span-4 h-[250px] rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (collegeError || !college) {
    return (
      <div className="flex-grow bg-[#fcf9f8] flex flex-col items-center justify-center p-12 min-h-screen">
        <h3 className="text-xl font-bold text-error">Failed to load college details</h3>
        <p className="text-sm font-semibold text-on-surface-variant mt-2 max-w-xs text-center">
          The requested university details could not be loaded. It may have been deleted or the slug is invalid.
        </p>
        <Link href="/colleges" className="mt-6">
          <Button variant="primary">Back to Search</Button>
        </Link>
      </div>
    );
  }

  const collegeRating = typeof college.rating === 'string' ? parseFloat(college.rating) : college.rating;
  const rawReviewsCount = reviews ? reviews.length : 0;

  return (
    <div className="flex-grow bg-background text-on-surface font-body-md text-body-md antialiased min-h-screen flex flex-col">
      
      {/* Dynamic Hero Section Matching Stitch Visual Guide */}
      <section className="relative w-full bg-primary pt-12 pb-20 px-6 md:px-10 overflow-hidden border-b border-border-subtle">
        
        {/* Sweeping Majestic Campus Background Image */}
        {college.cover_url && (
          <div 
            className="absolute inset-0 opacity-40 bg-cover bg-center" 
            style={{ backgroundImage: `url(${college.cover_url})` }}
          />
        )}
        
        {/* Deep navy brand color gradient overlay to guarantee high-contrast text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/85 to-primary/30" />
        
        <div className="relative max-w-container-max mx-auto flex flex-col md:flex-row items-end gap-6 md:gap-8 z-10">
          
          {/* Logo overlapping banner */}
          <div className="w-24 h-24 md:w-32 md:h-32 bg-surface rounded-xl p-2 shadow-lg border border-border-subtle flex-shrink-0 relative top-6 md:top-12 z-20 flex items-center justify-center">
            {college.logo_url ? (
              <img 
                alt={`${college.name} Logo`} 
                className="w-full h-full object-contain rounded-lg" 
                src={college.logo_url} 
              />
            ) : (
              <Building2 className="w-full h-full text-outline/40" />
            )}
          </div>

          {/* Header Metadata */}
          <div className="flex-1 pb-4 md:pb-0 text-white">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              {college.ranking && (
                <span className="px-2.5 py-1 bg-white/10 text-white rounded font-label-sm text-label-sm flex items-center gap-1">
                  <Award size={14} className="text-secondary" />
                  <span>#{college.ranking} NIRF Rank</span>
                </span>
              )}
              <span className="px-2.5 py-1 bg-white/10 text-white rounded font-label-sm text-label-sm">
                {college.type} Institution
              </span>
              <span className="px-2.5 py-1 bg-white/10 text-white rounded font-label-sm text-label-sm">
                AICTE Approved
              </span>
            </div>

            <h1 className="font-display-lg text-3xl md:text-5xl font-extrabold tracking-tight mb-3">
              {college.name}
            </h1>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-white/80 font-body-sm text-body-sm">
              <span className="flex items-center gap-1">
                <MapPin size={16} className="text-secondary" />
                {college.location}
              </span>
              <span className="flex items-center gap-1">
                <Star size={16} className="text-secondary fill-secondary" />
                <span>{collegeRating.toFixed(1)} ({rawReviewsCount} Reviews)</span>
              </span>
              {college.established && (
                <span className="flex items-center gap-1">
                  <Calendar size={16} className="text-secondary" />
                  Established in {college.established}
                </span>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* Sticky In-Page Navigation matching Stitch top-40 sticky offset */}
      <div className="sticky top-20 w-full bg-surface/95 backdrop-blur-md z-30 border-b border-border-subtle shadow-sm">
        <div className="max-w-container-max mx-auto px-6 md:px-10">
          <div className="flex gap-8 overflow-x-auto scrollbar-none">
            {tabs.map((tab) => {
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`py-4 font-label-md text-sm font-semibold transition-all duration-200 border-b-2 border-transparent ${
                    isActive 
                      ? 'text-primary border-primary' 
                      : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Grid content with Sidebar and Overview panels */}
      <div className="max-w-container-max mx-auto px-6 md:px-10 py-16 w-full flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Content panels column */}
          <div className="lg:col-span-8 space-y-12">
            {activeTab === 'overview' && <CollegeOverview college={college} />}

            {activeTab === 'courses' && (
              isCoursesLoading || !courses ? (
                <div className="flex flex-col gap-4">
                  <Skeleton className="h-12 w-full rounded" />
                  <Skeleton className="h-40 w-full rounded-lg" />
                </div>
              ) : (
                <CollegeCourses courses={courses} />
              )
            )}

            {activeTab === 'placements' && (
              isPlacementsLoading || !placements ? (
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-3 gap-6">
                    <Skeleton className="h-24 w-full rounded-lg" />
                    <Skeleton className="h-24 w-full rounded-lg" />
                    <Skeleton className="h-24 w-full rounded-lg" />
                  </div>
                  <Skeleton className="h-[200px] w-full rounded-lg" />
                </div>
              ) : (
                <CollegePlacements placements={placements} />
              )
            )}

            {activeTab === 'reviews' && (
              isReviewsLoading || !reviews ? (
                <div className="grid grid-cols-3 gap-8">
                  <Skeleton className="col-span-2 h-[350px] rounded-lg" />
                  <Skeleton className="col-span-1 h-[200px] rounded-lg" />
                </div>
              ) : (
                <CollegeReviews reviews={reviews} collegeSlug={slug} />
              )
            )}
          </div>

          {/* Sticky Sidebar match Stanford admissions cards */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="bg-surface border border-border-subtle p-6 shadow-sm sticky top-40 flex flex-col gap-6">
              <div>
                <h3 className="font-headline-md text-xl font-bold text-on-surface">Admissions Open 2026</h3>
                <p className="font-body-sm text-xs font-semibold text-on-surface-variant mt-2 leading-relaxed">
                  Deadline for active admissions brackets approaches soon. Lock your preferences now.
                </p>
              </div>

              <div className="flex flex-col gap-4 border-b border-border-subtle pb-4">
                <div className="flex justify-between items-center pb-2 border-b border-border-subtle/40">
                  <span className="font-body-sm text-sm font-semibold text-on-surface-variant">Entrance Exams</span>
                  <span className="font-label-md text-sm font-bold text-on-surface">JEE Main / Adv</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-body-sm text-sm font-semibold text-on-surface-variant">Acceptance Rate</span>
                  <span className="font-label-md text-sm font-bold text-on-surface">Top 5% Cutoffs</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button 
                  variant="secondary" 
                  className="w-full py-3.5 flex items-center justify-center gap-1.5 shadow-sm"
                  onClick={() => alert('Application flow triggers soon!')}
                >
                  <span>Start Application</span>
                  <ChevronRight size={16} />
                </Button>
                
                <Button 
                  variant={isSaved ? 'outline' : 'ghost'} 
                  className={`w-full py-3.5 flex items-center justify-center gap-2 ${
                    isSaved ? 'text-secondary border-secondary bg-secondary/5' : ''
                  }`}
                  onClick={() => setIsSaved(!isSaved)}
                >
                  <Heart size={16} className={isSaved ? 'fill-secondary text-secondary' : ''} />
                  <span>{isSaved ? 'Shortlisted' : 'Save to Shortlist'}</span>
                </Button>
              </div>
            </Card>
          </div>

        </div>
      </div>

    </div>
  );
}

export default function CollegeDetailPage() {
  return (
    <React.Suspense fallback={
      <div className="flex-grow bg-[#fcf9f8] py-24 min-h-screen flex items-center justify-center">
        <div className="text-lg font-bold text-outline animate-pulse">Loading College Details...</div>
      </div>
    }>
      <CollegeDetailContent />
    </React.Suspense>
  );
}
