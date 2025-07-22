
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
import { AddReviewForm } from '@/components/widget/add-review-form';
import { MessageSquare, PlusCircle } from 'lucide-react';
import type { IWidget } from '@/models/widget';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import StarRating from '../widget/star-rating';
import { Separator } from '../ui/separator';

export function ManageReviewsDialog({ widget }: { widget: IWidget }) {
  const [open, setOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
            setShowAddForm(false); // Reset form view on close
        }
    }}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="flex-1">
          <MessageSquare className="mr-2 h-4 w-4" />
          Manage Reviews
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Manage Reviews for {widget.businessName}</DialogTitle>
          <DialogDescription>
            View existing reviews or add a new one manually.
          </DialogDescription>
        </DialogHeader>

        {showAddForm ? (
            <AddReviewForm 
                widgetId={widget._id.toString()} 
                onFormSuccess={() => setShowAddForm(false)} 
                source="Dashboard"
            />
        ) : (
            <>
                <ScrollArea className="h-72 pr-6">
                    <div className="space-y-4">
                    {widget.reviews.length > 0 ? widget.reviews.slice().reverse().map(review => (
                        <div key={review._id.toString()} className="flex items-start gap-4">
                            <Avatar className="h-10 w-10 border">
                                <AvatarImage src={`https://placehold.co/40x40.png?text=${review.name.charAt(0)}`} data-ai-hint="person avatar" />
                                <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-semibold">{review.name}</p>
                                        <p className="text-xs text-muted-foreground">Source: {review.source}</p>
                                    </div>
                                    <StarRating rating={review.stars} iconClassName="w-4 h-4" />
                                </div>
                                <p className="text-sm text-foreground/80 mt-2">{review.text}</p>
                            </div>
                        </div>
                    )) : (
                        <p className="text-muted-foreground text-center py-12">No reviews yet.</p>
                    )}
                    </div>
                </ScrollArea>
                 <Separator />
                <Button onClick={() => setShowAddForm(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Review
                </Button>
            </>
        )}
        
        <DialogFooter>
             {showAddForm && (
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                    Back to Reviews
                </Button>
             )}
          <DialogClose asChild>
            <Button variant="secondary">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
