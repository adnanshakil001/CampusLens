'use client';

import * as React from 'react';
import { MapPin, Calendar, Award, BookOpen, Star, DollarSign, Building } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { StarRating } from '@/components/ui/StarRating';
import { College } from '@/hooks/useColleges';

interface CollegeDetailHeaderProps {
  college: College;
}

export const CollegeDetailHeader: React.FC<CollegeDetailHeaderProps> = ({ college }) => {
  const collegeRating = typeof college.rating === 'string' ? parseFloat(college.rating) : college.rating;

  const formatFees = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} Lakhs / year`;
    }
    return `₹${amount.toLocaleString('en-IN')} / year`;
  };

  return (
    <div className="relative w-full bg-primary text-white overflow-hidden py-16 lg:py-24 border-b border-border-subtle">
      {/* Background Graphic overlay */}
      {college.cover_url && (
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25 filter blur-xs" style={{ backgroundImage: `url(${college.cover_url})` }} />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        
        {/* Logo and metadata details */}
        <div className="flex flex-col sm:flex-row items-start gap-6 max-w-4xl">
          <div className="h-24 w-24 rounded-2xl bg-white border border-white/20 p-2 shadow-2xl shrink-0 flex items-center justify-center">
            {college.logo_url ? (
              <img src={college.logo_url} alt="" className="h-full w-full object-contain rounded-xl" />
            ) : (
              <Building size={48} className="text-primary" />
            )}
          </div>
          
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="bg-secondary text-white border-none font-bold">
                {college.type} Institute
              </Badge>
              {college.ranking && (
                <Badge variant="success" className="bg-status-success text-white border-none font-bold flex items-center gap-1">
                  <Award size={12} />
                  NIRF #{college.ranking}
                </Badge>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight font-sans text-white">
              {college.name}
            </h1>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-semibold text-white/80">
              <span className="flex items-center gap-1.5">
                <MapPin size={16} className="text-secondary" />
                {college.location}
              </span>
              {college.established && (
                <span className="flex items-center gap-1.5">
                  <Calendar size={16} className="text-secondary" />
                  Established in {college.established}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Rating and Fees right-panel summary stats */}
        <div className="flex flex-col sm:flex-row gap-6 lg:gap-8 shrink-0 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-2xl">
          <div className="flex flex-col gap-1 pr-6 border-r border-white/10">
            <span className="text-xs font-bold text-white/60 uppercase tracking-widest">Average Review</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-extrabold text-white">{collegeRating.toFixed(1)}</span>
              <div className="flex flex-col gap-0.5">
                <StarRating rating={collegeRating} size={14} className="stroke-white" />
                <span className="text-3xs text-white/50 font-bold uppercase tracking-wider">Out of 5 Stars</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-white/60 uppercase tracking-widest">Annual Fees (Avg)</span>
            <span className="text-2xl font-extrabold text-white">{formatFees(college.fees)}</span>
          </div>
        </div>

      </div>
    </div>
  );
};
