
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AddReviewForm } from './add-review-form';

export function AddReviewDialog({ widgetId }: { widgetId: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Write a Review</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Write a review</DialogTitle>
          <DialogDescription>
            Share your experience with {widgetId.businessName}.
          </DialogDescription>
        </DialogHeader>
        <AddReviewForm widgetId={widgetId} onFormSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
