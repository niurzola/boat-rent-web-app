import { prisma } from '@/lib/prisma';
import { PrihodiList } from '@/components/prihodi-list';

export default async function PrihodiPage() {
  const rezervacije = await prisma.zAVRSNI_REZERVACIJA.findMany({
    select: {
      DATUM: true,
      UKUPNA_CIJENA: true,
    },
  });

  return <PrihodiList rezervacije={rezervacije} />;
}
