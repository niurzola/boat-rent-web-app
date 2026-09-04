'use client';
import Link from 'next/link';
import { useActionState } from 'react';
import { registerUserAction } from '@/lib/actions/auth-actions';

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

export function SignupForm() {
  const [formState, formAction] = useActionState(registerUserAction, INITIAL_STATE);

  return (
    <div className="w-full max-w-md">
      <form action={formAction}>
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold text-foreground">Sign Up</CardTitle>
            <CardDescription>Enter your details to create a new account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" name="username" placeholder="username" />
              <ZodErrors error={formState?.zodErrors?.username} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ime">Ime</Label>
              <Input id="ime" name="ime" placeholder="noa" />
              <ZodErrors error={formState?.zodErrors?.ime} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prezime">Prezime</Label>
              <Input id="prezime" name="prezime" placeholder="noa" />
              <ZodErrors error={formState?.zodErrors?.prezime} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lozinka">Password</Label>
              <Input id="lozinka" name="lozinka" type="password" placeholder="password" />
              <ZodErrors error={formState?.zodErrors?.lozinka} />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button type="submit" className="w-full">
              Sign Up
            </Button>
          </CardFooter>
        </Card>
        <div className="mt-4 text-center text-sm">
          Have an account?
          <Link className="ml-2 text-primary" href="signin">
            Sign In
          </Link>
        </div>
      </form>
    </div>
  );
}
