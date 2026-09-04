'use client';
import Link from 'next/link';
import { useActionState } from 'react';
import { signinUserAction } from '@/lib/actions/auth-actions';

import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from '@/components/ui/card';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ZodErrors } from '@/components/zoderrors';

const INITIAL_STATE = {
  data: null,
  zodErrors: null,
  message: null,
};

export function SigninForm() {
  const [formState, formAction] = useActionState(signinUserAction, INITIAL_STATE);

  return (
    <div className="w-full max-w-md">
      <form action={formAction}>
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold text-foreground">Sign In</CardTitle>
            <CardDescription>Enter your details to sign in to your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" name="username" type="text" placeholder="username" />
              <ZodErrors error={formState?.zodErrors?.username} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lozinka">Password</Label>
              <Input id="lozinka" name="lozinka" type="password" placeholder="password" />
              <ZodErrors error={formState?.zodErrors?.lozinka} />
            </div>
            {formState?.message && <p className="text-sm text-destructive">{formState.message}</p>}
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </CardFooter>
        </Card>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?
          <Link className="ml-2 text-primary" href="signup">
            Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
}
