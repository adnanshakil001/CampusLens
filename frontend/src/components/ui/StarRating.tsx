import * as React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxStars = 5,
  size = 18,
  interactive = false,
  onChange,
  className,
}) => {
  const [hoverRating, setHoverRating] = React.useState<number | null>(null);

  const displayRating = hoverRating !== null ? hoverRating : rating;

  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {Array.from({ length: maxStars }).map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= Math.floor(displayRating);
        const isHalf = !isFilled && starValue - 0.5 <= displayRating;

        return (
          <button
            key={index}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange?.(starValue)}
            onMouseEnter={() => interactive && setHoverRating(starValue)}
            onMouseLeave={() => interactive && setHoverRating(null)}
            className={cn(
              'focus:outline-none transition-colors duration-150',
              interactive ? 'cursor-pointer hover:scale-110 active:scale-95' : 'cursor-default'
            )}
          >
            <Star
              size={size}
              className={cn(
                'stroke-1.5',
                isFilled
                  ? 'fill-secondary text-secondary'
                  : isHalf
                  ? 'fill-secondary/50 text-secondary'
                  : 'text-outline/40'
              )}
            />
          </button>
        );
      })}
    </div>
  );
};
