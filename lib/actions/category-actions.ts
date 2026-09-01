'use server';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

/// validacijska shema za kategoriju
const categorySchema = z.object({
  naziv: z.string().trim().min(1, 'Naziv je obavezan').max(32, 'Naziv predugačak'),
});

/// validacijska shema za cijenu
const priceSchema = z.object({
  idKategorije: z.string().min(1, 'Kategorija je obavezna'),
  trajanjeNajma: z.string().min(1, 'Trajanje najma je obavezno'),
  cijena: z.string().min(1, 'Cijena je obavezna'),
});

/// funkcija za dodavanje nove kategorije
export async function addCategory(prevState: any, formData: FormData) {
  const parsed = categorySchema.safeParse({
    naziv: formData.get('naziv'),
  });

  if (!parsed.success) {
    return {
      ...prevState,
      zodErrors: z.flattenError(parsed.error).fieldErrors,
      message: 'Provjeri unos',
    };
  }

  const { naziv } = parsed.data;

  /// provjera postoji li kategorija
  const existing = await prisma.zAVRSNI_KATEGORIJA.findUnique({
    where: { NAZIV: naziv },
  });

  if (existing) {
    return {
      ...prevState,
      zodErrors: { naziv: ['Kategorija već postoji'] },
      message: 'Provjeri unos',
    };
  }

  await prisma.zAVRSNI_KATEGORIJA.create({
    data: { NAZIV: naziv },
  });

  redirect('/cijene');
}

/// funkcija za dodavanje cijene kategoriji
export async function addPrice(prevState: any, formData: FormData) {
  const parsed = priceSchema.safeParse({
    idKategorije: formData.get('idKategorije'),
    trajanjeNajma: formData.get('trajanjeNajma'),
    cijena: formData.get('cijena'),
  });

  if (!parsed.success) {
    return {
      ...prevState,
      zodErrors: z.flattenError(parsed.error).fieldErrors,
      message: 'Provjeri unos',
    };
  }

  const { idKategorije, trajanjeNajma, cijena } = parsed.data;
  const trajanje = Number(trajanjeNajma);
  const iznos = Number(cijena);
  const idKategorijeNum = Number(idKategorije);

  await prisma.zAVRSNI_CIJENA.create({
    data: {
      CIJENA: iznos,
      TRAJANJE_NAJMA: trajanje,
      ID_KATEGORIJE: idKategorijeNum,
    },
  });

  redirect('/cijene');
}
