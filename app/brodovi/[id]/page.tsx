import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { BoatForm } from '@/components/boat-form';
import { updateBoat } from '@/lib/actions/boat-actions';

export default async function UrediBrodaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const idBroda = Number(id);

  const boat = await prisma.zAVRSNI_BROD.findUnique({
    where: { ID_BRODA: idBroda },
  });

  if (!boat) notFound();

  const kategorije = await prisma.zAVRSNI_KATEGORIJA.findMany({
    orderBy: { NAZIV: 'asc' },
    select: { ID_KATEGORIJE: true, NAZIV: true },
  });

  return <BoatForm boat={boat} kategorije={kategorije} action={updateBoat} />;
}
