'use client';
import { useRef, useActionState } from 'react';
import Link from 'next/link';
import { deleteBoat } from '@/lib/actions/boat-actions';
import { Button } from '@/components/ui/button';

type BrodItemProps = {
  brod: {
    ID_BRODA: number;
    MODEL_BRODA: string;
    BOJA: string | null;
    REGISTRACIJA: string;
    STATUS: string | null;
    ZAVRSNI_KATEGORIJA: { NAZIV: string } | null;
    ZAVRSNI_CIJENA?: { TRAJANJE_NAJMA: number; CIJENA: number | bigint | string }[];
  };
};

const INITIAL_STATE = { message: null as string | null };

export function BoatItem({ brod }: BrodItemProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(deleteBoat, INITIAL_STATE);

  function handleDelete(e: React.MouseEvent) {
    if (!confirm('Sigurno želiš obrisati ovaj brod?')) {
      e.preventDefault();
      return;
    }
    formRef.current?.requestSubmit();
  }

  return (
    <li className="rounded-lg border p-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="font-medium">
            {brod.MODEL_BRODA}
            <span className="ml-2 text-muted-foreground">({brod.REGISTRACIJA})</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {brod.BOJA && `${brod.BOJA} · `}
            {brod.STATUS} · {brod.ZAVRSNI_KATEGORIJA?.NAZIV ?? 'Bez kategorije'}
          </div>
          {brod.ZAVRSNI_CIJENA && brod.ZAVRSNI_CIJENA.length > 0 && (
            <div className="mt-1 text-sm text-muted-foreground">
              {brod.ZAVRSNI_CIJENA.map((c) => `${c.TRAJANJE_NAJMA}h - ${c.CIJENA} kn`).join(' · ')}
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Link href={`/brodovi/${brod.ID_BRODA}`}>
            <Button variant="outline" size="sm">
              Uredi
            </Button>
          </Link>
          <form ref={formRef} action={formAction}>
            <input type="hidden" name="id" value={brod.ID_BRODA} />
            <Button type="button" variant="destructive" size="sm" onClick={handleDelete}>
              Obriši
            </Button>
          </form>
        </div>
      </div>
      {state?.message && <p className="mt-2 text-sm text-destructive">{state.message}</p>}
    </li>
  );
}
