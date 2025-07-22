
'use client';

import { useEffect, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Star } from 'lucide-react';

import { addReview, type AddReviewState } from '@/lib/actions';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Submitting...' : 'Submit Review'}
    </Button>
  );
}

interface AddReviewFormProps {
    widgetId: string;
    onFormSuccess: () => void;
}

export function AddReviewForm({ widgetId, onFormSuccess }: AddReviewFormProps) {
  const initialState: AddReviewState = { message: null, errors: {} };
  const addReviewWithWidgetId = addReview.bind(null, widgetId);
  const [state, dispatch] = useFormState(addReviewWithWidgetId, initialState);
  
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);


  useEffect(() => {
    if (state.message) {
        if(state.errors) {
            toast({
                variant: 'destructive',
                title: 'Error submitting review',
                description: state.message,
            });
        } else {
            toast({
                title: 'Success!',
                description: state.message,
            });
            onFormSuccess();
        }
    }
  }, [state, toast, onFormSuccess]);

  return (
    <form action={dispatch} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Your Name</Label>
        <Input id="name" name="name" required aria-describedby="name-error" />
        {state.errors?.name && (
          <p id="name-error" className="text-sm text-destructive">
            {state.errors.name.join(', ')}
          </p>
        )}
      </div>

       <div className="space-y-2">
        <Label htmlFor="stars">Rating</Label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={cn(
                'w-6 h-6 cursor-pointer transition-colors',
                (hoverRating >= star || rating >= star)
                  ? 'text-accent fill-accent'
                  : 'text-muted-foreground/30'
              )}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
            />
          ))}
        </div>
        <input type="hidden" name="stars" value={rating} />
        {state.errors?.stars && (
          <p id="stars-error" className="text-sm text-destructive">
            {state.errors.stars.join(', ')}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="text">Review</Label>
        <Textarea id="text" name="text" required aria-describedby="text-error" />
        {state.errors?.text && (
          <p id="text-error" className="text-sm text-destructive">
            {state.errors.text.join(', ')}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <SubmitButton />
      </div>
    </form>
  );
}
