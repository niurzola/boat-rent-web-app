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
const styles = {
  container: 'w-full max-w-md',
  header: 'space-y-1',
  title: 'text-3xl font-bold text-pink-500',
  content: 'space-y-4',
  fieldGroup: 'space-y-2',
  footer: 'flex flex-col',
  button: 'w-full',
  prompt: 'mt-4 text-center text-sm',
  link: 'ml-2 text-pink-500',
};

export function SignupForm() {
  const [formState, formAction] = useActionState(registerUserAction, INITIAL_STATE);
  console.log(formState, 'client');
  return (
    <div className={styles.container}>
      <form action={formAction}>
        <Card>
          <CardHeader className={styles.header}>
            <CardTitle className={styles.title}>Sign Up</CardTitle>
            <CardDescription>Enter your details to create a new account</CardDescription>
          </CardHeader>
          <CardContent className={styles.content}>
            <div className={styles.fieldGroup}>
              <Label htmlFor="username">Username</Label>
              <Input id="username" name="username" placeholder="username" />
              <ZodErrors error={formState?.zodErrors?.username} />
            </div>
            <div className={styles.fieldGroup}>
              <Label htmlFor="email">Ime</Label>
              <Input id="ime" name="ime" placeholder="noa" />
              <ZodErrors error={formState?.zodErrors?.ime} />
            </div>
            <div className={styles.fieldGroup}>
              <Label htmlFor="email">Prezime</Label>
              <Input id="prezime" name="prezime" placeholder="noa" />
              <ZodErrors error={formState?.zodErrors?.prezime} />
            </div>
            <div className={styles.fieldGroup}>
              <Label htmlFor="password">Password</Label>
              <Input id="lozinka" name="lozinka" type="password" placeholder="password" />
              <ZodErrors error={formState?.zodErrors?.lozinka} />
            </div>
          </CardContent>
          <CardFooter className={styles.footer}>
            <Button type="submit" className={styles.button}>
              Sign Up
            </Button>
          </CardFooter>
        </Card>
        <div className={styles.prompt}>
          Have an account?
          <Link className={styles.link} href="signin">
            Sign In
          </Link>
        </div>
      </form>
    </div>
  );
}
