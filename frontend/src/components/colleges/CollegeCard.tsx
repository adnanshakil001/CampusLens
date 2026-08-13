'use client';

import * as React from 'react';
import Link from 'next/link';
import { MapPin, Calendar, Award, BookOpen, ChevronRight, GitCompare, Heart, GraduationCap, TrendingUp, DollarSign } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { StarRating } from '@/components/ui/StarRating';
import { College } from '@/hooks/useColleges';
import { cn } from '@/lib/cn';

interface CollegeCardProps {
  college: College;
  isComparing?: boolean;
  onCompareToggle?: () => void;
  isSaved?: boolean;
  onSaveToggle?: () => void;
}

export const CollegeCard: React.FC<CollegeCardProps> = ({
  college,
  isComparing = false,
  onCompareToggle,
  isSaved = false,
  onSaveToggle,
}) => {
  // Format fees to lakhs if >= 1,00,000
  const formatFees = (amount: number) => {
    if (!amount) return '₹2.20 Lakhs / yr';
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)}L / yr`;
    }
    return `₹${amount.toLocaleString('en-IN')} / yr`;
  };

  const collegeRating = typeof college.rating === 'string' ? parseFloat(college.rating) : college.rating || 4.5;
  const avgPackage = college.avg_package || '₹18.5 LPA';
  const highestPackage = college.highest_package || '₹1.2 Cr';

  return (
    <Card className="flex flex-col h-full group p-0 relative bg-white border border-gray-200/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-200 active:scale-[0.995]">
      
      {/* Cover / Header Media (Fixed 16:9 Aspect Ratio) */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-900">
        {college.cover_url ? (
          <img
            src={college.cover_url}
            alt={college.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-950 via-slate-900 to-black text-white/40">
            <BookOpen size={48} className="stroke-1" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Overlay Ranking Badge */}
        {college.ranking && (
          <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white text-xs font-extrabold px-2.5 py-1 rounded-lg border border-white/20 flex items-center gap-1 shadow-md">
            <Award size={13} className="text-orange-400" />
            <span>NIRF #{college.ranking}</span>
          </div>
        )}

        {/* Placement Package Callout Pill on Image Header */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/80 backdrop-blur-md border border-emerald-500/30 text-emerald-300 text-xs font-bold shadow-md">
          <TrendingUp size={12} className="text-emerald-400" />
          <span>Avg CTC: {avgPackage}</span>
        </div>

        {/* Saved Toggle Button */}
        {onSaveToggle && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onSaveToggle();
            }}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/40 backdrop-blur-md text-white hover:text-orange-400 active:scale-95 transition-all border border-white/20 shadow-md cursor-pointer"
          >
            <Heart size={15} className={cn(isSaved && 'fill-orange-500 text-orange-500')} />
          </button>
        )}
      </div>

      {/* College Info Body */}
      <div className="flex-1 flex flex-col p-5 relative bg-white">
        
        {/* Floating Logo Badge overlapping cover image */}
        <div className="absolute -top-7 right-5 h-14 w-14 rounded-xl border-2 border-white overflow-hidden bg-white shadow-lg p-1">
          {college.logo_url ? (
            <img
              src={college.logo_url}
              alt={`${college.name} logo`}
              className="h-full w-full object-contain rounded-lg"
            />
          ) : (
            <GraduationCap className="h-full w-full text-gray-400" />
          )}
        </div>

        {/* Category Badge & Title */}
        <div className="mt-2 mb-4 flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
              {college.type || 'Government'} College
            </span>
          </div>
          
          <h3 className="text-base font-extrabold text-gray-900 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
            <Link href={`/colleges/${college.slug || college.id}`}>
              {college.name}
            </Link>
          </h3>
          
          {/* Location & Established Info */}
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2.5 text-xs font-semibold text-gray-500">
            <span className="flex items-center gap-1">
              <MapPin size={14} className="text-gray-400" />
              {college.location}
            </span>
            {college.established && (
              <span className="flex items-center gap-1">
                <Calendar size={14} className="text-gray-400" />
                Est. {college.established}
              </span>
            )}
          </div>
        </div>

        {/* Rating and Fees Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 py-3 px-3.5 bg-gray-50/80 rounded-xl border border-gray-100 mb-5">
          <div className="flex flex-col justify-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Rating</span>
            <div className="flex items-center gap-1">
              <span className="text-sm font-extrabold text-gray-900">{collegeRating.toFixed(1)}</span>
              <StarRating rating={collegeRating} size={13} />
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Tuition Fee</span>
            <span className="text-xs font-extrabold text-indigo-900">{formatFees(college.fees)}</span>
          </div>
        </div>

        {/* Compare Checkbox & View Details CTA */}
        <div className="flex items-center justify-between gap-3 mt-auto pt-2">
          {onCompareToggle && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onCompareToggle();
              }}
              className={cn(
                'flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors active:scale-95 cursor-pointer',
                isComparing && 'border-orange-500 text-orange-600 bg-orange-50'
              )}
            >
              <GitCompare size={14} />
              <span>{isComparing ? 'Comparing' : 'Compare'}</span>
            </button>
          )}

          <Link href={`/colleges/${college.slug || college.id}`} className="ml-auto">
            <Button variant="primary" size="sm" className="rounded-xl px-4 font-bold active:scale-[0.97]">
              <span>Details</span>
              <ChevronRight size={14} className="ml-1" />
            </Button>
          </Link>
        </div>

      </div>
    </Card>
  );
};

