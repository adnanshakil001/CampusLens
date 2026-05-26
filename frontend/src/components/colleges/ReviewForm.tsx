'use client';

import * as React from 'react';
import { StarRating } from '@/components/ui/StarRating';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';

interface ReviewFormProps {
  onSubmit: (rating: number, comment: string) => Promise<void>;
  isLoading?: boolean;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit, isLoading = false }) => {
  const [rating, setRating] = React.useState<number>(5);
  const [comment, setComment] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (comment.length < 5) {
      setError('Your review comments must be at least 5 characters long.');
      return;
    }

    try {
      await onSubmit(rating, comment);
      setComment('');
      setRating(5);
    } catch (err: any) {
      setError(err.message || 'Failed to submit review.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 bg-surface-muted/30 border border-border-subtle p-5 rounded-xl">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-bold text-on-surface-variant">Select Rating Rating</label>
        <StarRating
          rating={rating}
          interactive
          onChange={setRating}
          size={24}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-bold text-on-surface-variant">Your Review Comments</label>
        <textarea
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience, college life, professors, hostel facilities, or campus placement insights..."
          className="w-full bg-white border border-border-subtle rounded-xl p-3 text-sm text-on-surface transition-all duration-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
        />
        {error && <span className="text-xs text-error font-medium mt-1">{error}</span>}
      </div>

      <Button variant="primary" type="submit" isLoading={isLoading} className="self-start">
        Submit Review
      </Button>
    </form>
  );
};
