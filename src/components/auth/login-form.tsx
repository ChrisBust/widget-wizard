'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { authenticate } from '@/lib/actions';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Logo from '@/components/logo';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Logging in...' : 'Login'}
    </Button>
  );
}

export function LoginForm() {
  const [errorMessage, dispatch] = useActionState(authenticate, undefined);
  const { toast } = useToast();

  useEffect(() => {
    if (errorMessage) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: errorMessage,
      });
    }
  }, [errorMessage, toast]);

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Logo className="w-12 h-12 text-primary" />
        </div>
        <CardTitle>Welcome Back</CardTitle>
        <CardDescription>
          Enter your credentials to access your dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={dispatch} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="user">Username</Label>
            <Input
              id="user"
              name="user"
              placeholder="Your username"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>
           {errorMessage && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Login Error</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          <div className="pt-2">
            <LoginButton />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
