'use client';
import { useActionState } from 'react';
import { addBoat, updateBoat } from '@/lib/actions/boat-actions';

import { Card, CardTitle, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Field, FieldLabel, FieldContent, FieldError, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ZAVRSNI_BROD_STATUS } from '@/generated/prisma/enums';

/// initial value prije ikakvog submita, useactionstate puni ovo
const INITIAL_STATE = { zodErrors: null, message: null };
type Kategorija = { ID_KATEGORIJE: number; NAZIV: string };
type Brod = {
  ID_BRODA: number;
  MODEL_BRODA: string;
  BOJA: string | null;
  REGISTRACIJA: string;
  STATUS: string | null;
  ID_KATEGORIJE: number | null;
};

/// kategorije server dohvati i preda client komponenti; boat je opcionalan (editiranje), action odabire funkcju
export function BoatForm({
  kategorije,
  boat,
  action = addBoat,
}: {
  kategorije: Kategorija[];
  boat?: Brod;
  action?: typeof addBoat | typeof updateBoat;
}) {
  const [formState, formAction] = useActionState(action, INITIAL_STATE);
  const zodErrors = formState?.zodErrors;
  const isEditing = !!boat;

  return (
    <form action={formAction} className="w-full max-w-md">
      <Card>
        <CardHeader>
          <CardTitle className="text-center cursor-pointer">
            {isEditing ? 'Uredi Brod' : 'Dodaj Brod'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing && <input type="hidden" name="id" value={boat.ID_BRODA} />}
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="model">Model</FieldLabel>
              <FieldContent>
                <Input id="model" name="model" defaultValue={boat?.MODEL_BRODA} />
                <FieldError errors={zodErrors?.model} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="boja">Boja</FieldLabel>
              <FieldContent>
                <Input id="boja" name="boja" defaultValue={boat?.BOJA ?? ''} />
                <FieldError errors={zodErrors?.boja} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="registracija">Registracija</FieldLabel>
              <FieldContent>
                <Input id="registracija" name="registracija" defaultValue={boat?.REGISTRACIJA} />
                <FieldError errors={zodErrors?.registracija} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="status">Status</FieldLabel>
              <FieldContent>
                <select
                  id="status"
                  name="status"
                  defaultValue={boat?.STATUS ?? undefined}
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
                  defaultValue={boat?.ID_KATEGORIJE ?? undefined}
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
            {isEditing ? 'Spremi izmjene' : 'Spremi brod'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
