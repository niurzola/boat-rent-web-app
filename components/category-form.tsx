'use client';
import { useActionState } from 'react';
import { addCategory } from '@/lib/actions/category-actions';
import { Card, CardTitle, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Field, FieldLabel, FieldContent, FieldError, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const INITIAL_STATE = { zodErrors: null, message: null };

export function CategoryForm() {
  const [formState, formAction] = useActionState(addCategory, INITIAL_STATE);
  const zodErrors = formState?.zodErrors;

  return (
    <form action={formAction} className="w-full max-w-md">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Dodaj kategoriju</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="naziv">Naziv kategorije</FieldLabel>
              <FieldContent>
                <Input id="naziv" name="naziv" placeholder="npr. Leidi" />
                <FieldError errors={zodErrors?.naziv} />
              </FieldContent>
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            Spremi kategoriju
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
