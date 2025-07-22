
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AddReviewForm } from './add-review-form';

export function AddReviewDialog({ widgetId, businessName }: { widgetId: string, businessName: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Write a Review</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Write a review</DialogTitle>
          <DialogDescription>
            Share your experience with {businessName}.
          </DialogDescription>
        </DialogHeader>
        <AddReviewForm widgetId={widgetId} onFormSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
