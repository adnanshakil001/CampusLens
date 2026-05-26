'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Calendar, Award, BookOpen, ChevronRight, GitCompare, Heart } from 'lucide-react';
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
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} Lakhs / year`;
    }
    return `₹${amount.toLocaleString('en-IN')} / year`;
  };

  const collegeRating = typeof college.rating === 'string' ? parseFloat(college.rating) : college.rating;

  return (
    <Card className="flex flex-col h-full group p-0 relative bg-surface hover:shadow-lg transition-all duration-300">
      {/* Cover / Header Media */}
      <div className="relative h-44 w-full overflow-hidden bg-surface-muted">
        {college.cover_url ? (
          <img
            src={college.cover_url}
            alt={college.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary/40">
            <BookOpen size={48} className="stroke-1" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Overlay ranking badge */}
        {college.ranking && (
          <div className="absolute top-4 left-4 bg-primary text-white text-xs font-extrabold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-md">
            <Award size={14} className="text-secondary" />
            <span>NIRF Rank #{college.ranking}</span>
          </div>
        )}

        {/* Saved Toggle Button */}
        {onSaveToggle && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onSaveToggle();
            }}
            className="absolute top-4 right-4 p-2 rounded-full glassmorphism text-white hover:text-secondary active:scale-95 transition-all shadow-md"
          >
            <Heart size={16} className={cn(isSaved && 'fill-secondary text-secondary')} />
          </button>
        )}
      </div>

      {/* College Info Body */}
      <div className="flex-1 flex flex-col p-5 relative">
        {/* Logo overlapping cover */}
        <div className="absolute -top-10 left-5 h-16 w-16 rounded-xl border border-border-subtle overflow-hidden bg-white shadow-md p-1">
          {college.logo_url ? (
            <img
              src={college.logo_url}
              alt={`${college.name} logo`}
              className="h-full w-full object-contain rounded-lg"
            />
          ) : (
            <GraduationCap className="h-full w-full text-outline" />
          )}
        </div>

        {/* Title / established details */}
        <div className="mt-8 mb-4 flex-1">
          <Badge variant={college.type === 'Government' ? 'primary' : 'secondary'} className="mb-2">
            {college.type} College
          </Badge>
          
          <h3 className="text-lg font-bold text-on-surface line-clamp-2 leading-snug group-hover:text-primary transition-colors">
            <Link href={`/colleges/${college.slug}`}>
              {college.name}
            </Link>
          </h3>
          
          {/* Location & Established info */}
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2.5 text-xs font-semibold text-on-surface-variant">
            <span className="flex items-center gap-1">
              <MapPin size={14} className="text-outline" />
              {college.location}
            </span>
            {college.established && (
              <span className="flex items-center gap-1">
                <Calendar size={14} className="text-outline" />
                Est. {college.established}
              </span>
            )}
          </div>
        </div>

        {/* Rating and Fees Grid */}
        <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-border-subtle mb-5">
          <div className="flex flex-col justify-center">
            <span className="text-xs font-bold text-outline uppercase tracking-wider mb-1">Average Rating</span>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-extrabold text-on-surface">{collegeRating.toFixed(1)}</span>
              <StarRating rating={collegeRating} size={14} />
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <span className="text-xs font-bold text-outline uppercase tracking-wider mb-1">Annual Fees (Avg)</span>
            <span className="text-sm font-extrabold text-primary">{formatFees(college.fees)}</span>
          </div>
        </div>

        {/* Compare checkbox and View details CTA */}
        <div className="flex items-center justify-between gap-4 mt-auto">
          {onCompareToggle && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onCompareToggle();
              }}
              className={cn(
                'flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg border-2 border-border-subtle text-on-surface-variant hover:bg-surface-muted transition-colors active:scale-95',
                isComparing && 'border-secondary text-secondary bg-secondary/5'
              )}
            >
              <GitCompare size={14} />
              <span>{isComparing ? 'Comparing' : 'Compare'}</span>
            </button>
          )}

          <Link href={`/colleges/${college.slug}`} className="ml-auto">
            <Button variant="primary" size="sm" className="flex items-center gap-1">
              <span>View Details</span>
              <ChevronRight size={14} />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};
