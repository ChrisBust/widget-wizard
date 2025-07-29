'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import type { IWidget } from '@/models/widget';
import { importReviews, type ImportState } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? 'Importing Reviews...' : 'Start Import'}
    </Button>
  );
}

interface ImportReviewsFormProps {
  widgets: Pick<IWidget, '_id' | 'businessName'>[];
}

export default function ImportReviewsForm({ widgets }: ImportReviewsFormProps) {
  const initialState: ImportState = { message: null, errors: {} };
  const [state, dispatch] = useActionState(importReviews, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message) {
      if (state.errors && Object.keys(state.errors).length > 0) {
        toast({
          variant: 'destructive',
          title: 'Import Error',
          description: state.message,
        });
      } else {
        toast({
          title: 'Import Complete',
          description: state.message,
        });
      }
    }
  }, [state, toast]);

  return (
    <form action={dispatch}>
      <Card>
        <CardHeader>
          <CardTitle>Import Reviews from Text</CardTitle>
          <CardDescription>
            Select a widget and paste the reviews in the specified format to import them in bulk.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="widgetId">Select Widget</Label>
            <Select name="widgetId" required>
                <SelectTrigger id="widgetId" aria-describedby='widgetId-error'>
                    <SelectValue placeholder="Select a widget to add reviews to..." />
                </SelectTrigger>
                <SelectContent>
                {widgets.map(widget => (
                    <SelectItem key={widget._id.toString()} value={widget._id.toString()}>
                        {widget.businessName}
                    </SelectItem>
                ))}
                </SelectContent>
            </Select>
            {state.errors?.widgetId && (
              <p id="widgetId-error" className="text-sm text-destructive">
                {state.errors.widgetId.join(', ')}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="reviewsText">Reviews Text</Label>
            <Textarea
              id="reviewsText"
              name="reviewsText"
              required
              rows={8}
              placeholder={'reviews (Google Reviews){ { User: "John Doe" Rate: 5 commentary: "Great service!" },\n{ User: "Jane Smith" Rate: 4 commentary: "Very helpful staff." } }'}
              aria-describedby="reviewsText-error"
            />
             {state.errors?.reviewsText && (
              <p id="reviewsText-error" className="text-sm text-destructive">
                {state.errors.reviewsText.join(', ')}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            Our AI will parse this text and import the reviews.
          </p>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/dashboard">Cancel</Link>
            </Button>
            <SubmitButton />
          </div>
        </CardFooter>
      </Card>
    </form>
  );
}
