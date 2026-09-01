'use client';
import { useActionState } from 'react';
import { addPrice } from '@/lib/actions/category-actions';

import { Field, FieldLabel, FieldContent, FieldError, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { Kategorija } from '@/app/cijene/page';

const INITIAL_STATE = { zodErrors: null, message: null };

export function PriceForm({
  kat,
  existingTrajanja,
}: {
  kat: Kategorija;
  existingTrajanja: number[];
}) {
  const [formState, formAction] = useActionState(addPrice, INITIAL_STATE);
  const zodErrors = formState?.zodErrors;

  return (
    <form action={formAction} className="w-full">
      <div className="mb-2 text-sm font-medium">Dodaj cijenu za {kat.NAZIV}</div>

      <FieldGroup>
        <div className="flex flex-wrap items-end gap-3">
          <Field className="w-40">
            <FieldLabel htmlFor={`trajanje-${kat.ID_KATEGORIJE}`}>Trajanje (h)</FieldLabel>
            <FieldContent>
              <Input
                id={`trajanje-${kat.ID_KATEGORIJE}`}
                name="trajanjeNajma"
                type="number"
                min="1"
                step="1"
                placeholder="npr. 2"
              />
              <FieldError errors={zodErrors?.trajanjeNajma} />
            </FieldContent>
          </Field>

          <Field className="w-40">
            <FieldLabel htmlFor={`cijena-${kat.ID_KATEGORIJE}`}>Cijena (kn)</FieldLabel>
            <FieldContent>
              <Input
                id={`cijena-${kat.ID_KATEGORIJE}`}
                name="cijena"
                type="number"
                min="0"
                step="0.01"
                placeholder="npr. 40"
              />
              <FieldError errors={zodErrors?.cijena} />
            </FieldContent>
          </Field>

          <input type="hidden" name="idKategorije" value={kat.ID_KATEGORIJE} />
          <Button type="submit">Dodaj cijenu</Button>
        </div>
        <FieldError errors={zodErrors?.idKategorije} />
      </FieldGroup>
    </form>
  );
}
