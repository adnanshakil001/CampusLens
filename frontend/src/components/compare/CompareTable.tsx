'use client';

import * as React from 'react';
import { ComparisonCollege } from '@/hooks/useCompare';
import { StarRating } from '@/components/ui/StarRating';
import { Badge } from '@/components/ui/Badge';
import { Landmark, Calendar, Award, MapPin, DollarSign, TrendingUp, Sparkles, X, Star } from 'lucide-react';

interface CompareTableProps {
  colleges: ComparisonCollege[];
  onRemove: (id: number) => void;
}

export const CompareTable: React.FC<CompareTableProps> = ({ colleges, onRemove }) => {
  // Helpers to find the best (winning) values in the row to highlight!
  const bestRank = React.useMemo(() => {
    const ranks = colleges.map((c) => c.ranking).filter((r): r is number => r !== undefined && r !== null);
    return ranks.length > 0 ? Math.min(...ranks) : null;
  }, [colleges]);

  const bestRating = React.useMemo(() => {
    const ratings = colleges.map((c) => (typeof c.rating === 'string' ? parseFloat(c.rating) : c.rating));
    return Math.max(...ratings);
  }, [colleges]);

  const lowestFees = React.useMemo(() => {
    const fees = colleges.map((c) => c.fees);
    return Math.min(...fees);
  }, [colleges]);

  const bestHighestPackage = React.useMemo(() => {
    const pkgs = colleges
      .map((c) => (c.latestPlacement ? Number(c.latestPlacement.highest_package) : 0))
      .filter((p) => p > 0);
    return pkgs.length > 0 ? Math.max(...pkgs) : null;
  }, [colleges]);

  const bestAvgPackage = React.useMemo(() => {
    const pkgs = colleges
      .map((c) => (c.latestPlacement ? Number(c.latestPlacement.average_package) : 0))
      .filter((p) => p > 0);
    return pkgs.length > 0 ? Math.max(...pkgs) : null;
  }, [colleges]);

  const formatFees = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} Lakhs`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <div className="bg-white border border-border-subtle rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse border-spacing-0">
          <thead>
            <tr className="border-b border-border-subtle bg-surface-muted/40">
              <th className="py-6 px-6 font-bold text-on-surface text-sm w-56 border-r border-border-subtle/50">
                Criteria Matrix
              </th>
              {colleges.map((col) => (
                <th key={col.id} className="py-6 px-6 relative border-r border-border-subtle/50 last:border-r-0 min-w-[280px]">
                  {/* Remove pill button */}
                  <button
                    onClick={() => onRemove(col.id)}
                    className="absolute top-4 right-4 p-1.5 rounded-lg bg-surface-muted text-on-surface-variant hover:text-error hover:bg-error/5 active:scale-95 transition-all shadow-2xs"
                  >
                    <X size={14} />
                  </button>

                  <div className="flex flex-col gap-3">
                    <div className="h-14 w-14 bg-white border border-border-subtle rounded-xl p-1 shadow-sm flex items-center justify-center">
                      {col.logo_url ? (
                        <img src={col.logo_url} alt="" className="h-full w-full object-contain rounded-lg" />
                      ) : (
                        <Landmark size={28} className="text-outline/40" />
                      )}
                    </div>
                    <div>
                      <Badge variant={col.type === 'Government' ? 'primary' : 'secondary'} className="mb-1">
                        {col.type}
                      </Badge>
                      <h4 className="text-sm font-extrabold text-on-surface line-clamp-2 leading-snug">
                        {col.name}
                      </h4>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Row 1: NIRF Ranking */}
            <tr className="border-b border-border-subtle/50 hover:bg-surface-muted/20">
              <td className="py-4 px-6 font-bold text-on-surface-variant text-xs uppercase tracking-wider bg-surface-muted/10 border-r border-border-subtle/50">
                <div className="flex items-center gap-2">
                  <Award size={14} className="text-outline" />
                  NIRF Ranking
                </div>
              </td>
              {colleges.map((col) => {
                const isWinner = col.ranking && col.ranking === bestRank;
                return (
                  <td
                    key={col.id}
                    className={`py-4 px-6 text-sm font-extrabold border-r border-border-subtle/50 last:border-r-0 ${
                      isWinner ? 'bg-status-success/5 text-status-success' : 'text-on-surface'
                    }`}
                  >
                    {col.ranking ? `Rank #${col.ranking}` : 'N/A'}
                    {isWinner && <span className="text-2xs font-extrabold block text-status-success/75 mt-0.5 uppercase tracking-wide">Best Rank</span>}
                  </td>
                );
              })}
            </tr>

            {/* Row 2: Location */}
            <tr className="border-b border-border-subtle/50 hover:bg-surface-muted/20">
              <td className="py-4 px-6 font-bold text-on-surface-variant text-xs uppercase tracking-wider bg-surface-muted/10 border-r border-border-subtle/50">
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-outline" />
                  Location
                </div>
              </td>
              {colleges.map((col) => (
                <td key={col.id} className="py-4 px-6 text-sm font-semibold text-on-surface border-r border-border-subtle/50 last:border-r-0">
                  {col.location}
                </td>
              ))}
            </tr>

            {/* Row 3: Established Year */}
            <tr className="border-b border-border-subtle/50 hover:bg-surface-muted/20">
              <td className="py-4 px-6 font-bold text-on-surface-variant text-xs uppercase tracking-wider bg-surface-muted/10 border-r border-border-subtle/50">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-outline" />
                  Established
                </div>
              </td>
              {colleges.map((col) => (
                <td key={col.id} className="py-4 px-6 text-sm font-semibold text-on-surface border-r border-border-subtle/50 last:border-r-0">
                  {col.established || 'N/A'}
                </td>
              ))}
            </tr>

            {/* Row 4: Annual Fees */}
            <tr className="border-b border-border-subtle/50 hover:bg-surface-muted/20">
              <td className="py-4 px-6 font-bold text-on-surface-variant text-xs uppercase tracking-wider bg-surface-muted/10 border-r border-border-subtle/50">
                <div className="flex items-center gap-2">
                  <DollarSign size={14} className="text-outline" />
                  Annual Fees
                </div>
              </td>
              {colleges.map((col) => {
                const isWinner = col.fees === lowestFees;
                return (
                  <td
                    key={col.id}
                    className={`py-4 px-6 text-sm font-extrabold border-r border-border-subtle/50 last:border-r-0 ${
                      isWinner ? 'bg-status-success/5 text-status-success' : 'text-primary'
                    }`}
                  >
                    {formatFees(col.fees)} / yr
                    {isWinner && <span className="text-2xs font-extrabold block text-status-success/75 mt-0.5 uppercase tracking-wide">Most Affordable</span>}
                  </td>
                );
              })}
            </tr>

            {/* Row 5: Average Rating */}
            <tr className="border-b border-border-subtle/50 hover:bg-surface-muted/20">
              <td className="py-4 px-6 font-bold text-on-surface-variant text-xs uppercase tracking-wider bg-surface-muted/10 border-r border-border-subtle/50">
                <div className="flex items-center gap-2">
                  <Star size={14} className="text-outline" />
                  Average Rating
                </div>
              </td>
              {colleges.map((col) => {
                const r = typeof col.rating === 'string' ? parseFloat(col.rating) : col.rating;
                const isWinner = r === bestRating;
                return (
                  <td
                    key={col.id}
                    className={`py-4 px-6 border-r border-border-subtle/50 last:border-r-0 ${
                      isWinner ? 'bg-status-success/5' : ''
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-extrabold text-on-surface">{r.toFixed(1)}</span>
                      <StarRating rating={r} size={12} />
                    </div>
                    {isWinner && <span className="text-2xs font-extrabold block text-status-success/75 mt-1 uppercase tracking-wide">Highest Rated</span>}
                  </td>
                );
              })}
            </tr>

            {/* Row 6: Highest Placement */}
            <tr className="border-b border-border-subtle/50 hover:bg-surface-muted/20">
              <td className="py-4 px-6 font-bold text-on-surface-variant text-xs uppercase tracking-wider bg-surface-muted/10 border-r border-border-subtle/50">
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-outline" />
                  Highest Package
                </div>
              </td>
              {colleges.map((col) => {
                const val = col.latestPlacement ? Number(col.latestPlacement.highest_package) : 0;
                const isWinner = val > 0 && val === bestHighestPackage;
                return (
                  <td
                    key={col.id}
                    className={`py-4 px-6 text-sm font-extrabold border-r border-border-subtle/50 last:border-r-0 ${
                      isWinner ? 'bg-status-success/5 text-status-success' : 'text-on-surface'
                    }`}
                  >
                    {val > 0 ? `₹${val} LPA` : 'N/A'}
                    {isWinner && <span className="text-2xs font-extrabold block text-status-success/75 mt-0.5 uppercase tracking-wide">Record High</span>}
                  </td>
                );
              })}
            </tr>

            {/* Row 7: Average Placement */}
            <tr className="border-b border-border-subtle/50 hover:bg-surface-muted/20">
              <td className="py-4 px-6 font-bold text-on-surface-variant text-xs uppercase tracking-wider bg-surface-muted/10 border-r border-border-subtle/50">
                <div className="flex items-center gap-2">
                  <TrendingUp size={14} className="text-outline" />
                  Average Package
                </div>
              </td>
              {colleges.map((col) => {
                const val = col.latestPlacement ? Number(col.latestPlacement.average_package) : 0;
                const isWinner = val > 0 && val === bestAvgPackage;
                return (
                  <td
                    key={col.id}
                    className={`py-4 px-6 text-sm font-extrabold border-r border-border-subtle/50 last:border-r-0 ${
                      isWinner ? 'bg-status-success/5 text-status-success' : 'text-primary'
                    }`}
                  >
                    {val > 0 ? `₹${val} LPA` : 'N/A'}
                    {isWinner && <span className="text-2xs font-extrabold block text-status-success/75 mt-0.5 uppercase tracking-wide">Highest Average</span>}
                  </td>
                );
              })}
            </tr>

            {/* Row 8: Available Courses Count */}
            <tr className="hover:bg-surface-muted/20">
              <td className="py-4 px-6 font-bold text-on-surface-variant text-xs uppercase tracking-wider bg-surface-muted/10 border-r border-border-subtle/50">
                <div className="flex items-center gap-2">
                  <Landmark size={14} className="text-outline" />
                  Total Courses
                </div>
              </td>
              {colleges.map((col) => (
                <td key={col.id} className="py-4 px-6 text-sm font-semibold text-on-surface border-r border-border-subtle/50 last:border-r-0">
                  {col.coursesCount} Programs
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
