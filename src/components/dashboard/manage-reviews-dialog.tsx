
'use client';

import { useState, useTransition } from 'react';
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
import { MessageSquare, PlusCircle, Trash2 } from 'lucide-react';
import type { IWidget } from '@/models/widget';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import StarRating from '../widget/star-rating';
import { Separator } from '../ui/separator';
import { deleteReview } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export function ManageReviewsDialog({ widget }: { widget: IWidget }) {
  const [open, setOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleDeleteReview = (reviewId: string) => {
    startTransition(async () => {
      const result = await deleteReview(widget._id.toString(), reviewId);
      if (result.success) {
        toast({
          title: 'Success',
          description: result.message,
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.message,
        });
      }
    });
  };

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
                                    <div className="flex items-center gap-2">
                                      <StarRating rating={review.stars} iconClassName="w-4 h-4" />
                                       <AlertDialog>
                                          <AlertDialogTrigger asChild>
                                            <Button size="icon" variant="ghost" className="h-6 w-6 text-muted-foreground hover:text-destructive">
                                              <Trash2 className="h-4 w-4" />
                                            </Button>
                                          </AlertDialogTrigger>
                                          <AlertDialogContent>
                                            <AlertDialogHeader>
                                              <AlertDialogTitle>Delete this review?</AlertDialogTitle>
                                              <AlertDialogDescription>
                                                This will permanently delete the review from "{review.name}". This action cannot be undone.
                                              </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                              <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                                              <AlertDialogAction 
                                                onClick={() => handleDeleteReview(review._id.toString())} 
                                                disabled={isPending}
                                                className="bg-destructive hover:bg-destructive/90"
                                              >
                                                {isPending ? 'Deleting...' : 'Delete'}
                                              </AlertDialogAction>
                                            </AlertDialogFooter>
                                          </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
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
                <Button onClick={() => setShowAddForm(true)} disabled={isPending}>
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
