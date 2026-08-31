import { prisma } from '@/lib/prisma';
import { BoatForm } from '@/components/boat-form';

export default async function NoviBrodPage() {
  ///dohvaca kategorije da ih forma moze ucitat
  const kategorije = await prisma.zAVRSNI_KATEGORIJA.findMany({
    orderBy: { NAZIV: 'asc' },
    select: { ID_KATEGORIJE: true, NAZIV: true },
  });

  return <BoatForm kategorije={kategorije} />;
}
