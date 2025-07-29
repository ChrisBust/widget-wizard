
'use client';

import { useEffect, useState, useTransition } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { addReview, type AddReviewState } from '@/lib/actions';
import { useActionState } from 'react';

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
  source?: 'Direct' | 'Dashboard';
  apiBaseUrl?: string; // Only needed if source is 'Direct'
}

export function AddReviewForm({ widgetId, onFormSuccess, source = 'Direct', apiBaseUrl }: AddReviewFormProps) {
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isPending, startTransition] = useTransition();

  const [formKey, setFormKey] = useState(Date.now()); // Used to reset the form

  // For Dashboard submissions, we use a server action.
  const initialState: AddReviewState = { message: null, errors: {} };
  const addReviewWithWidgetId = addReview.bind(null, widgetId);
  const [state, dispatch] = useActionState(addReviewWithWidgetId, initialState);
  
  useEffect(() => {
    if (source === 'Dashboard' && state.message) {
      if (state.errors && Object.keys(state.errors).length > 0) {
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
        setRating(0);
        setFormKey(Date.now()); // Reset form
      }
    }
  }, [state, toast, onFormSuccess, source]);


  // For Direct widget submissions, we use fetch to the API endpoint.
  const handleSubmitDirect = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});

    const formData = new FormData(event.currentTarget);
    const data = {
      name: formData.get('name'),
      stars: parseInt(formData.get('stars') as string, 10),
      text: formData.get('text'),
      source: formData.get('source'),
    };

    startTransition(async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/widgets/${widgetId}/reviews`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
          if (result.details) {
            setErrors(result.details);
          }
          throw new Error(result.error || 'Network response was not ok');
        }

        toast({
            title: 'Success!',
            description: 'Thank you for your review!',
        });
        onFormSuccess();
        setRating(0);
        (event.target as HTMLFormElement).reset();
        setFormKey(Date.now()); // Reset form by changing key

      } catch (error) {
        toast({
            variant: 'destructive',
            title: 'Error submitting review',
            description: error instanceof Error ? error.message : 'An unknown error occurred.',
        });
      }
    });
  };

  const formAction = source === 'Dashboard' ? dispatch : handleSubmitDirect;

  return (
    <form key={formKey} action={source === 'Dashboard' ? (formAction as (payload: FormData) => void) : undefined} onSubmit={source === 'Direct' ? (formAction as (event: React.FormEvent<HTMLFormElement>) => void) : undefined} className="space-y-4 py-4">
      <input type="hidden" name="source" value={source} />
      <div className="space-y-2">
        <Label htmlFor="name">Your Name</Label>
        <Input id="name" name="name" required aria-describedby="name-error" />
        {errors?.name && <p id="name-error" className="text-sm text-destructive">{errors.name.join(', ')}</p>}
        {state.errors?.name && <p id="name-error" className="text-sm text-destructive">{state.errors.name.join(', ')}</p>}
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
        {errors?.stars && <p id="stars-error" className="text-sm text-destructive">{errors.stars.join(', ')}</p>}
        {state.errors?.stars && <p id="stars-error" className="text-sm text-destructive">{state.errors.stars.join(', ')}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="text">Review</Label>
        <Textarea id="text" name="text" required aria-describedby="text-error" />
        {errors?.text && <p id="text-error" className="text-sm text-destructive">{errors.text.join(', ')}</p>}
        {state.errors?.text && <p id="text-error" className="text-sm text-destructive">{state.errors.text.join(', ')}</p>}
      </div>

      <div className="flex justify-end gap-2 pt-4">
         <Button type="submit" disabled={isPending}>
            {isPending ? 'Submitting...' : 'Submit Review'}
         </Button>
      </div>
    </form>
  );
}
