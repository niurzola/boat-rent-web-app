'use client';
import { useActionState } from 'react';
import { addBoat } from '@/lib/actions/boat-actions';

import { Card, CardTitle, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Field, FieldLabel, FieldContent, FieldError, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ZAVRSNI_BROD_STATUS } from '@/generated/prisma/enums';
/// initial value prije ikakvog submita, useactionstate puni ovo
const INITIAL_STATE = { zodErrors: null, message: null };
type Kategorija = { ID_KATEGORIJE: number; NAZIV: string };
/// kategorije je prop, jer client componenta ne moze pristupit bazi, server dohvati i preda client komponenti
export function BoatForm({ kategorije }: { kategorije: Kategorija[] }) {
  ///formaction akcija koja se pokrene na submit, formstate najnoviji value od addboat,(zoderrors)
  const [formState, formAction] = useActionState(addBoat, INITIAL_STATE);
  const zodErrors = formState?.zodErrors;
  return (
    ///server action pokrene se kad user submita
    <form action={formAction} className="w-full max-w-md">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Dodaj Brod</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="model">Model</FieldLabel>
              <FieldContent>
                <Input id="model" name="model" />
                <FieldError errors={zodErrors?.model} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="boja">Boja</FieldLabel>
              <FieldContent>
                <Input id="boja" name="boja" />
                <FieldError errors={zodErrors?.boja} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="registracija">Registracija</FieldLabel>
              <FieldContent>
                <Input id="registracija" name="registracija" />
                <FieldError errors={zodErrors?.registracija} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="status">Status</FieldLabel>
              <FieldContent>
                <select
                  id="status"
                  name="status"
                  className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5"
                >
                  {Object.entries(ZAVRSNI_BROD_STATUS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="kategorija">Kategorija</FieldLabel>
              <FieldContent>
                <select
                  id="kategorija"
                  name="kategorija"
                  className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5"
                >
                  <option value="">Odaberi kategoriju</option>
                  {kategorije.map((k) => (
                    <option key={k.ID_KATEGORIJE} value={k.ID_KATEGORIJE}>
                      {k.NAZIV}
                    </option>
                  ))}
                </select>
                <FieldError errors={zodErrors?.kategorija} />
              </FieldContent>
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            Spremi brod
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
