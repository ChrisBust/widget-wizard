
'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { createWidget, type State } from '@/lib/actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? 'Creating Widget...' : 'Create Widget'}
    </Button>
  );
}

export default function CreateWidgetForm() {
  const initialState: State = { message: null, errors: {} };
  const [state, dispatch] = useActionState(createWidget, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message && state.errors) {
      toast({
        variant: 'destructive',
        title: 'Error creating widget',
        description: state.message,
      });
    }
  }, [state, toast]);

  return (
    <form action={dispatch}>
      <Card>
        <CardHeader>
          <CardTitle>Create a New Widget</CardTitle>
          <CardDescription>Enter your business details to generate a reviews widget.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name</Label>
            <Input
              id="businessName"
              name="businessName"
              placeholder="e.g., Acme Inc."
              required
              aria-describedby="businessName-error"
            />
            {state.errors?.businessName && (
              <p id="businessName-error" className="text-sm text-destructive">
                {state.errors.businessName.join(', ')}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Website URL</Label>
            <Input
              id="website"
              name="website"
              placeholder="https://example.com"
              required
              aria-describedby="website-error"
            />
            {state.errors?.website && (
              <p id="website-error" className="text-sm text-destructive">
                {state.errors.website.join(', ')}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground text-center sm:text-left">
                You can add reviews to your widget after creating it.
            </p>
            <div className='flex gap-2'>
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
