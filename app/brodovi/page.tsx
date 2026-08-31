import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';

export default async function Brodovi() {
  ///dohvaca sve brodove + cijenu
  const brodovi = await prisma.zAVRSNI_BROD.findMany({
    include: {
      ZAVRSNI_KATEGORIJA: { include: { ZAVRSNI_CIJENA: true } },
    },
    orderBy: { MODEL_BRODA: 'asc' },
  });

  return (
    <div className="w-full max-w-3xl space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Brodovi</h1>
        <Link href="/brodovi/novi">
          <Button>Dodaj novi brod</Button>
        </Link>
      </div>
      {/*ucitava brod po brod u listu */}
      <ul className="space-y-2">
        {brodovi.map((brod) => (
          <li key={brod.ID_BRODA} className="rounded-lg border p-3">
            <div className="font-medium">
              {brod.MODEL_BRODA}
              <span className="ml-2 text-muted-foreground">({brod.REGISTRACIJA})</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {brod.BOJA && `${brod.BOJA} · `}
              {brod.STATUS} · {brod.ZAVRSNI_KATEGORIJA?.NAZIV ?? 'Bez kategorije'}
            </div>
            {brod.ZAVRSNI_KATEGORIJA && brod.ZAVRSNI_KATEGORIJA.ZAVRSNI_CIJENA.length > 0 && (
              <div className="mt-1 text-sm text-muted-foreground">
                {brod.ZAVRSNI_KATEGORIJA.ZAVRSNI_CIJENA.map(
                  (c) => `${c.TRAJANJE_NAJMA}h - ${Number(c.CIJENA)} kn`
                ).join(' · ')}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
