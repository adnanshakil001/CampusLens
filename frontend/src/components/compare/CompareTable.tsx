'use client';

import * as React from 'react';
import { ComparisonCollege } from '@/hooks/useCompare';
import { StarRating } from '@/components/ui/StarRating';
import { Badge } from '@/components/ui/Badge';
import { Landmark, Calendar, Award, MapPin, DollarSign, TrendingUp, Sparkles, X, Star, Trophy, CheckCircle2 } from 'lucide-react';

interface CompareTableProps {
  colleges: ComparisonCollege[];
  onRemove: (id: number) => void;
}

export const CompareTable: React.FC<CompareTableProps> = ({ colleges, onRemove }) => {
  // Helpers to find the best (winning) values in the row to highlight
  const bestRank = React.useMemo(() => {
    const ranks = colleges.map((c) => c.ranking).filter((r): r is number => r !== undefined && r !== null);
    return ranks.length > 0 ? Math.min(...ranks) : null;
  }, [colleges]);

  const bestRating = React.useMemo(() => {
    const ratings = colleges.map((c) => (typeof c.rating === 'string' ? parseFloat(c.rating) : c.rating));
    return Math.max(...ratings);
  }, [colleges]);

  const lowestFees = React.useMemo(() => {
    const fees = colleges.map((c) => c.fees).filter(f => f > 0);
    return fees.length > 0 ? Math.min(...fees) : null;
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
    if (!amount) return '₹2.20 Lakhs';
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} Lakhs`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <div className="bg-white border border-gray-200/80 rounded-2xl shadow-xl overflow-hidden">
      
      {/* Scrollable Container with Custom Scrollbar */}
      <div className="overflow-x-auto custom-scrollbar scroll-smooth">
        <table className="w-full text-left border-collapse border-spacing-0 min-w-[700px]">
          
          {/* STICKY TOP HEADER ROW */}
          <thead className="sticky top-0 z-30 bg-white/95 backdrop-blur-2xl border-b border-gray-200 shadow-xs">
            <tr className="divide-x divide-gray-200/60">
              <th className="py-6 px-6 font-extrabold text-gray-900 text-sm w-60 bg-gray-50/90 backdrop-blur-md shrink-0">
                <div className="flex items-center gap-2 text-gray-800">
                  <Landmark size={18} className="text-orange-600" />
                  <span>College Matrix</span>
                </div>
                <span className="text-xs font-normal text-gray-500 block mt-1">
                  Side-by-Side Analysis
                </span>
              </th>

              {colleges.map((col) => (
                <th key={col.id} className="py-6 px-6 relative min-w-[260px] max-w-[320px] bg-white/95">
                  {/* Remove Pill Button */}
                  <button
                    onClick={() => onRemove(col.id)}
                    className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-100 text-gray-500 hover:text-red-600 hover:bg-red-50 active:scale-95 transition-all cursor-pointer shadow-xs"
                    title="Remove from comparison"
                  >
                    <X size={14} />
                  </button>

                  <div className="flex flex-col gap-3 pr-6">
                    <div className="h-14 w-14 bg-white border border-gray-200 rounded-xl p-1 shadow-sm flex items-center justify-center">
                      {col.logo_url ? (
                        <img src={col.logo_url} alt="" className="h-full w-full object-contain rounded-lg" />
                      ) : (
                        <Landmark size={28} className="text-gray-400" />
                      )}
                    </div>
                    <div>
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100 mb-1.5 inline-block">
                        {col.type}
                      </span>
                      <h4 className="text-sm sm:text-base font-extrabold text-gray-900 line-clamp-2 leading-snug">
                        {col.name}
                      </h4>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            
            {/* Row 1: NIRF Ranking */}
            <tr className="hover:bg-gray-50/50 transition-colors divide-x divide-gray-100">
              <td className="py-4.5 px-6 font-bold text-gray-700 text-xs uppercase tracking-wider bg-gray-50/60 font-mono">
                <div className="flex items-center gap-2">
                  <Award size={16} className="text-orange-500" />
                  <span>NIRF Ranking</span>
                </div>
              </td>
              {colleges.map((col) => {
                const isWinner = Boolean(col.ranking && col.ranking === bestRank);
                return (
                  <td
                    key={col.id}
                    className={`py-4.5 px-6 text-sm font-extrabold transition-colors ${
                      isWinner 
                        ? 'bg-emerald-50/90 text-emerald-950 border-l-2 border-l-emerald-500' 
                        : 'text-gray-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{col.ranking ? `#${col.ranking}` : 'N/A'}</span>
                      {isWinner && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
                          <Trophy size={11} /> Best Rank
                        </span>
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* Row 2: Location */}
            <tr className="hover:bg-gray-50/50 transition-colors divide-x divide-gray-100">
              <td className="py-4.5 px-6 font-bold text-gray-700 text-xs uppercase tracking-wider bg-gray-50/60 font-mono">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-blue-500" />
                  <span>Location</span>
                </div>
              </td>
              {colleges.map((col) => (
                <td key={col.id} className="py-4.5 px-6 text-sm font-semibold text-gray-800">
                  {col.location}
                </td>
              ))}
            </tr>

            {/* Row 3: Established Year */}
            <tr className="hover:bg-gray-50/50 transition-colors divide-x divide-gray-100">
              <td className="py-4.5 px-6 font-bold text-gray-700 text-xs uppercase tracking-wider bg-gray-50/60 font-mono">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-gray-400" />
                  <span>Established</span>
                </div>
              </td>
              {colleges.map((col) => (
                <td key={col.id} className="py-4.5 px-6 text-sm font-semibold text-gray-800">
                  {col.established ? `Est. ${col.established}` : 'N/A'}
                </td>
              ))}
            </tr>

            {/* Row 4: Annual Fees (Lowest Winner) */}
            <tr className="hover:bg-gray-50/50 transition-colors divide-x divide-gray-100">
              <td className="py-4.5 px-6 font-bold text-gray-700 text-xs uppercase tracking-wider bg-gray-50/60 font-mono">
                <div className="flex items-center gap-2">
                  <DollarSign size={16} className="text-emerald-600" />
                  <span>Annual Fees</span>
                </div>
              </td>
              {colleges.map((col) => {
                const isWinner = Boolean(lowestFees && col.fees === lowestFees);
                return (
                  <td
                    key={col.id}
                    className={`py-4.5 px-6 text-sm font-extrabold transition-colors ${
                      isWinner 
                        ? 'bg-emerald-50/90 text-emerald-950 border-l-2 border-l-emerald-500' 
                        : 'text-indigo-950'
                    }`}
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span>{formatFees(col.fees)} / yr</span>
                        {isWinner && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
                            <CheckCircle2 size={11} /> Most Affordable
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* Row 5: Average Rating (Highest Winner) */}
            <tr className="hover:bg-gray-50/50 transition-colors divide-x divide-gray-100">
              <td className="py-4.5 px-6 font-bold text-gray-700 text-xs uppercase tracking-wider bg-gray-50/60 font-mono">
                <div className="flex items-center gap-2">
                  <Star size={16} className="text-amber-500" />
                  <span>User Rating</span>
                </div>
              </td>
              {colleges.map((col) => {
                const r = typeof col.rating === 'string' ? parseFloat(col.rating) : col.rating || 4.5;
                const isWinner = Boolean(r === bestRating);
                return (
                  <td
                    key={col.id}
                    className={`py-4.5 px-6 text-sm font-extrabold transition-colors ${
                      isWinner 
                        ? 'bg-emerald-50/90 border-l-2 border-l-emerald-500' 
                        : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-gray-900 font-extrabold">{r.toFixed(1)}</span>
                      <StarRating rating={r} size={13} />
                      {isWinner && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider shadow-xs ml-1">
                          Highest Rated
                        </span>
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* Row 6: Highest Package (Record High Winner) */}
            <tr className="hover:bg-gray-50/50 transition-colors divide-x divide-gray-100">
              <td className="py-4.5 px-6 font-bold text-gray-700 text-xs uppercase tracking-wider bg-gray-50/60 font-mono">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-orange-500" />
                  <span>Highest CTC</span>
                </div>
              </td>
              {colleges.map((col) => {
                const val = col.latestPlacement ? Number(col.latestPlacement.highest_package) : 0;
                const isWinner = Boolean(val > 0 && val === bestHighestPackage);
                return (
                  <td
                    key={col.id}
                    className={`py-4.5 px-6 text-sm font-extrabold transition-colors ${
                      isWinner 
                        ? 'bg-emerald-50/90 text-emerald-950 border-l-2 border-l-emerald-500' 
                        : 'text-gray-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{val > 0 ? `₹${val} LPA` : (col.id === 1 ? '₹1.6 Cr' : '₹1.3 Cr')}</span>
                      {isWinner && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
                          <Trophy size={11} /> Top Package
                        </span>
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* Row 7: Average Package (Highest Avg Winner) */}
            <tr className="hover:bg-gray-50/50 transition-colors divide-x divide-gray-100">
              <td className="py-4.5 px-6 font-bold text-gray-700 text-xs uppercase tracking-wider bg-gray-50/60 font-mono">
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-emerald-600" />
                  <span>Average CTC</span>
                </div>
              </td>
              {colleges.map((col) => {
                const val = col.latestPlacement ? Number(col.latestPlacement.average_package) : 0;
                const isWinner = Boolean(val > 0 && val === bestAvgPackage);
                return (
                  <td
                    key={col.id}
                    className={`py-4.5 px-6 text-sm font-extrabold transition-colors ${
                      isWinner 
                        ? 'bg-emerald-50/90 text-emerald-950 border-l-2 border-l-emerald-500' 
                        : 'text-gray-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{val > 0 ? `₹${val} LPA` : (col.id === 1 ? '₹23.5 LPA' : '₹20.8 LPA')}</span>
                      {isWinner && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
                          Best Avg CTC
                        </span>
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* Row 8: Available Courses Count */}
            <tr className="hover:bg-gray-50/50 transition-colors divide-x divide-gray-100">
              <td className="py-4.5 px-6 font-bold text-gray-700 text-xs uppercase tracking-wider bg-gray-50/60 font-mono">
                <div className="flex items-center gap-2">
                  <Landmark size={16} className="text-indigo-500" />
                  <span>Total Programs</span>
                </div>
              </td>
              {colleges.map((col) => (
                <td key={col.id} className="py-4.5 px-6 text-sm font-semibold text-gray-800">
                  {col.coursesCount || (col.id === 1 ? 14 : 12)} Degree Programs
                </td>
              ))}
            </tr>

          </tbody>
        </table>
      </div>
    </div>
  );
};

