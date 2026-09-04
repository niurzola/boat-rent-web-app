import { prisma } from '@/lib/prisma';
import { ReservationGrid } from '@/components/reservation-grid';

export default async function RezervacijePage() {
  const brodovi = await prisma.zAVRSNI_BROD.findMany({
    include: {
      ZAVRSNI_KATEGORIJA: { include: { ZAVRSNI_CIJENA: true } },
    },
    orderBy: { MODEL_BRODA: 'asc' },
  });

  const rezervacije = await prisma.zAVRSNI_REZERVACIJA.findMany({
    select: {
      ID_REZERVACIJE: true,
      ID_BRODA: true,
      DATUM: true,
      VRIJEME: true,
      VRIJEME_KRAJA: true,
      DEPOZIT: true,
      UKUPNA_CIJENA: true,
      KOMENTAR: true,
      ID_KLIJENTA: true,
      ZAVRSNI_KLIJENT: {
        select: {
          IME: true,
          PREZIME: true,
          TELEFON: true,
          NAPOMENA: true,
        },
      },
    },
  });

  return <ReservationGrid brodovi={brodovi} rezervacije={rezervacije} />;
}
