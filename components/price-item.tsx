'use client';
import { useRef, useState, useActionState } from 'react';
import { updatePrice, deletePrice } from '@/lib/actions/category-actions';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldLabel, FieldContent, FieldError, FieldGroup } from '@/components/ui/field';
import type { Cijena } from '@/app/cijene/page';

const EDIT_INITIAL_STATE = { zodErrors: null, message: null as string | null };
const DELETE_INITIAL_STATE = { message: null as string | null };

export function PriceItem({ cijena }: { cijena: Cijena }) {
  const [open, setOpen] = useState(false);
  const deleteRef = useRef<HTMLFormElement>(null);

  const [editState, editAction] = useActionState(updatePrice, EDIT_INITIAL_STATE);
  const [deleteState, deleteAction] = useActionState(deletePrice, DELETE_INITIAL_STATE);

  function handleDelete(e: React.MouseEvent) {
    if (!confirm('Sigurno želiš obrisati ovu cijenu?')) {
      e.preventDefault();
      return;
    }
    deleteRef.current?.requestSubmit();
  }

  return (
    <div>
      <div className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
        <span>
          {cijena.TRAJANJE_NAJMA}h - {cijena.CIJENA ?? 0}€
        </span>

        <div className="flex shrink-0 items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
            Uredi
          </Button>
          <form ref={deleteRef} action={deleteAction}>
            <input type="hidden" name="idCijene" value={cijena.ID_CIJENE} />
            <Button type="button" variant="destructive" size="sm" onClick={handleDelete}>
              Obriši
            </Button>
          </form>
        </div>
      </div>

      {deleteState?.message && (
        <p className="mt-1 px-1 text-sm text-destructive">{deleteState.message}</p>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Uredi cijenu</DialogTitle>
          </DialogHeader>

          <form action={editAction} className="space-y-4">
            <input type="hidden" name="idCijene" value={cijena.ID_CIJENE} />

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor={`trajanje-${cijena.ID_CIJENE}`}>Trajanje (h)</FieldLabel>
                <FieldContent>
                  <Input
                    id={`trajanje-${cijena.ID_CIJENE}`}
                    name="trajanjeNajma"
                    type="number"
                    min="1"
                    step="1"
                    defaultValue={cijena.TRAJANJE_NAJMA}
                  />
                  <FieldError errors={editState?.zodErrors?.trajanjeNajma} />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor={`cijena-${cijena.ID_CIJENE}`}>Cijena (€)</FieldLabel>
                <FieldContent>
                  <Input
                    id={`cijena-${cijena.ID_CIJENE}`}
                    name="cijena"
                    type="number"
                    min="0"
                    step="0.01"
                    defaultValue={cijena.CIJENA ?? 0}
                  />
                  <FieldError errors={editState?.zodErrors?.cijena} />
                </FieldContent>
              </Field>
            </FieldGroup>

            {editState?.message && <p className="text-sm text-destructive">{editState.message}</p>}

            <DialogFooter>
              <Button type="submit">Spremi</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
