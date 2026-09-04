import { prisma } from '@/lib/prisma';
import { CategoryForm } from '@/components/category-form';
import { PriceForm } from '@/components/price-form';
import { PriceItem } from '@/components/price-item';

/// type koju server predaje client komponentama
export type Cijena = {
  ID_CIJENE: number;
  TRAJANJE_NAJMA: number;
  CIJENA: number | null;
};

export type Kategorija = {
  ID_KATEGORIJE: number;
  NAZIV: string;
  _count: { ZAVRSNI_BROD: number };
  ZAVRSNI_CIJENA: Cijena[];
};

export default async function CijenePage() {
  /// dohvaca sve kategorije + njihove cijene + broj brodova
  const kategorije: Kategorija[] = await prisma.zAVRSNI_KATEGORIJA.findMany({
    include: {
      ZAVRSNI_CIJENA: { orderBy: { TRAJANJE_NAJMA: 'asc' } },
      _count: { select: { ZAVRSNI_BROD: true } },
    },
    orderBy: { NAZIV: 'asc' },
  });

  return (
    <div className="w-full max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Cijene</h1>
      </div>

      {/* forma za novu kategoriju */}
      <CategoryForm />

      {/* lista kategorija */}
      <ul className="space-y-3">
        {kategorije.map((k) => (
          <li key={k.ID_KATEGORIJE} className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div className="w-full">
                <div className="font-medium">
                  {k.NAZIV}
                  <span className="ml-2 text-sm text-muted-foreground">
                    ({k._count.ZAVRSNI_BROD} brodova)
                  </span>
                </div>

                {k.ZAVRSNI_CIJENA.length > 0 ? (
                  <div className="mt-2 space-y-1">
                    {k.ZAVRSNI_CIJENA.map((c) => (
                      <PriceItem key={c.ID_CIJENE} cijena={c} />
                    ))}
                  </div>
                ) : (
                  <div className="mt-1 text-sm text-muted-foreground">Nema definiranih cijena</div>
                )}
              </div>
            </div>

            {/* forma za dodavanje cijene ovoj kategoriji */}
            <div className="mt-3 border-t pt-3">
              <PriceForm kat={k} existingTrajanja={k.ZAVRSNI_CIJENA.map((c) => c.TRAJANJE_NAJMA)} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
