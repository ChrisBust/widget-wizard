import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  totalStars?: number;
  className?: string;
  iconClassName?: string;
}

export default function StarRating({
  rating,
  totalStars = 5,
  className,
  iconClassName,
}: StarRatingProps) {
  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {Array.from({ length: totalStars }, (_, i) => (
        <Star
          key={i}
          className={cn(
            'h-5 w-5',
            i < Math.round(rating) ? 'text-accent fill-accent' : 'text-muted-foreground/30',
            iconClassName
          )}
        />
      ))}
    </div>
  );
}
