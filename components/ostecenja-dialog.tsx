'use client';
import { useActionState } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldLabel, FieldContent, FieldError, FieldGroup } from '@/components/ui/field';
import { addOstecenje, deleteOstecenje } from '@/lib/actions/ostecenja-actions';

type Ostecenje = {
  ID_OSTECENJA: number;
  URL_SLIKE: string | null;
  OPIS: string | null;
};

type Props = {
  idBroda: number;
  ostecenja: Ostecenje[];
};

const INITIAL_STATE = { zodErrors: null, message: null };

export function OstecenjaDialog({ idBroda, ostecenja }: Props) {
  const [addState, addAction] = useActionState(addOstecenje, INITIAL_STATE);
  const [delState, delAction] = useActionState(deleteOstecenje, INITIAL_STATE);

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm">
            Oštećenja
          </Button>
        }
      />{' '}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Dodaj oštećenje</DialogTitle>
          <DialogDescription>Dodaj sliku oštećenja na brodu.</DialogDescription>
        </DialogHeader>

        {/* lista postojecih ostecenja */}
        {ostecenja.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {ostecenja.map((o) => (
              <div key={o.ID_OSTECENJA} className="relative rounded-lg border p-1">
                {o.URL_SLIKE && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={o.URL_SLIKE}
                    alt={o.OPIS ?? 'Oštećenje'}
                    className="h-24 w-full rounded-md object-cover"
                  />
                )}
                {o.OPIS && (
                  <p className="mt-1 line-clamp-2 px-0.5 text-xs text-muted-foreground">{o.OPIS}</p>
                )}
                <form action={delAction}>
                  <input type="hidden" name="idOstecenja" value={o.ID_OSTECENJA} />
                  <Button type="submit" variant="destructive" size="sm" className="mt-1 w-full">
                    Obriši
                  </Button>
                </form>
              </div>
            ))}
          </div>
        )}
        {ostecenja.length === 0 && (
          <p className="text-sm text-muted-foreground">Još nema zabilježenih oštećenja.</p>
        )}

        {/* forma za novu sliku */}
        <form action={addAction} className="space-y-4">
          <input type="hidden" name="idBroda" value={idBroda} />
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="slika">Slika oštećenja</FieldLabel>
              <FieldContent>
                <Input id="slika" name="slika" type="file" accept="image/*" />
                <FieldError errors={addState?.zodErrors?.slika} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="opis">Opis (opcionalno)</FieldLabel>
              <FieldContent>
                <textarea
                  id="opis"
                  name="opis"
                  rows={3}
                  className="w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                />
                <FieldError errors={addState?.zodErrors?.opis} />
              </FieldContent>
            </Field>
          </FieldGroup>
          {addState?.message && <p className="text-sm text-destructive">{addState.message}</p>}
          <DialogFooter>
            <DialogClose
              render={
                <Button type="button" variant="outline">
                  Zatvori
                </Button>
              }
            />
            <Button type="submit">Spremi sliku</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
