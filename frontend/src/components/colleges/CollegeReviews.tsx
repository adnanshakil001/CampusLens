'use client';

import * as React from 'react';
import { Review, useCreateReview } from '@/hooks/useCollege';
import { Card } from '@/components/ui/Card';
import { StarRating } from '@/components/ui/StarRating';
import { Button } from '@/components/ui/Button';
import { ReviewForm } from './ReviewForm';
import { useSession } from 'next-auth/react';
import { MessageSquare, Calendar, User, ChevronRight, PenTool } from 'lucide-react';
import Link from 'next/link';

interface CollegeReviewsProps {
  reviews: Review[];
  collegeSlug: string;
}

export const CollegeReviews: React.FC<CollegeReviewsProps> = ({ reviews, collegeSlug }) => {
  const { data: session } = useSession();
  const [showReviewForm, setShowReviewForm] = React.useState(false);

  // Zod mutation hook
  const createReviewMutation = useCreateReview(collegeSlug);

  // Review statistics
  const ratingDistribution = React.useMemo(() => {
    const counts = [0, 0, 0, 0, 0];
    reviews.forEach((r) => {
      const idx = Math.min(Math.max(r.rating - 1, 0), 4);
      counts[idx]++;
    });
    return counts.reverse(); // 5, 4, 3, 2, 1 stars
  }, [reviews]);

  const handleReviewSubmit = async (rating: number, comment: string) => {
    if (!session || !session.user.accessToken) {
      alert('You must be signed in to submit a review.');
      return;
    }

    await createReviewMutation.mutateAsync({
      rating,
      comment,
      token: session.user.accessToken,
    });
    
    setShowReviewForm(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Review list */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        <Card className="bg-white border-border-subtle p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-border-subtle/80">
            <div>
              <h3 className="text-lg font-bold text-on-surface">Student Reviews</h3>
              <p className="text-xs font-semibold text-on-surface-variant mt-0.5">
                Read direct student experiences and campus feedback reviews.
              </p>
            </div>
            
            {/* Show Form trigger */}
            {!showReviewForm && (
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1.5"
                onClick={() => {
                  if (session) {
                    setShowReviewForm(true);
                  } else {
                    alert('Please sign in to write a review.');
                  }
                }}
              >
                <PenTool size={14} />
                Write Review
              </Button>
            )}
          </div>

          {showReviewForm && (
            <div className="mb-6">
              <ReviewForm
                onSubmit={handleReviewSubmit}
                isLoading={createReviewMutation.isPending}
              />
            </div>
          )}

          {reviews.length > 0 ? (
            <div className="flex flex-col gap-6">
              {reviews.map((r) => (
                <div key={r.id} className="border-b border-border-subtle/40 last:border-0 pb-6 last:pb-0">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-extrabold uppercase">
                        {r.user_name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-on-surface leading-none">{r.user_name}</p>
                        <span className="text-3xs font-extrabold uppercase tracking-wider text-outline mt-1 inline-block">Verified Student</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-1.5">
                      <StarRating rating={r.rating} size={14} />
                      <span className="text-3xs font-semibold text-outline">
                        {new Date(r.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-on-surface-variant leading-relaxed mt-4 bg-surface-muted/30 border border-border-subtle/50 p-4 rounded-xl">
                    {r.comment}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 flex flex-col items-center gap-3">
              <MessageSquare size={36} className="text-outline/40" />
              <p className="text-sm font-bold text-on-surface">No student reviews posted yet.</p>
              <p className="text-xs font-semibold text-on-surface-variant max-w-xs">
                Be the first to review this college and share your insights with prospective students!
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* Review stats sidebar */}
      <div className="lg:col-span-1">
        <Card className="bg-white border-border-subtle p-6 rounded-xl shadow-sm">
          <h3 className="text-base font-bold text-on-surface mb-5 uppercase tracking-wider">Rating Breakdown</h3>
          <div className="flex flex-col gap-4">
            {ratingDistribution.map((count, index) => {
              const stars = 5 - index;
              const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
              return (
                <div key={stars} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-on-surface w-3">{stars}</span>
                  <div className="flex-1 h-2.5 bg-surface-muted rounded-full overflow-hidden border border-border-subtle/40">
                    <div
                      className="h-full bg-secondary transition-all duration-500 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-on-surface-variant w-8 text-right">
                    {count} revs
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};
