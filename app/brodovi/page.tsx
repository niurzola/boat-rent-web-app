import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { BoatItem } from '@/components/boat-item';

export default async function Brodovi() {
  ///dohvaca sve brodove + cijenu + ostecenja
  const brodovi = await prisma.zAVRSNI_BROD.findMany({
    include: {
      ZAVRSNI_KATEGORIJA: { include: { ZAVRSNI_CIJENA: true } },
      ZAVRSNI_OSTECENJA: true,
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
          <BoatItem key={brod.ID_BRODA} brod={brod} />
        ))}
      </ul>
    </div>
  );
}
