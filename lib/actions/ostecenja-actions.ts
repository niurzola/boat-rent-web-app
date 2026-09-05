'use server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { mkdir, writeFile, unlink } from 'node:fs/promises';
import path from 'node:path';
import { prisma } from '@/lib/prisma';

/// validacijska shema: slika je obavezna, opis opcionalan
const ostecenjeSchema = z.object({
  idBroda: z.string().min(1, 'Nedostaje id broda'),
  slika: z.instanceof(File).refine((f) => f.size > 0, 'Odaberi sliku'),
  opis: z.string().max(1000, 'Opis je predug').optional(),
});

const MAX_SIZE = 5 * 1024 * 1024; /// 5MB

/// folder gdje se slike spremaju (u public/ da budu dostupne preko URL-a)
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'ostecenja');

export async function addOstecenje(prevState: any, formData: FormData) {
  const parsed = ostecenjeSchema.safeParse({
    idBroda: formData.get('idBroda'),
    slika: formData.get('slika'),
    opis: (formData.get('opis') as string | null)?.trim() || undefined,
  });

  if (!parsed.success) {
    return {
      ...prevState,
      zodErrors: z.flattenError(parsed.error).fieldErrors,
      message: 'Provjeri unos',
    };
  }

  const { idBroda, slika, opis } = parsed.data;
  const id = Number(idBroda);

  /// limit veličine
  if (slika.size > MAX_SIZE) {
    return {
      ...prevState,
      zodErrors: { slika: ['Slika je prevelika (max 5MB)'] },
      message: 'Provjeri unos',
    };
  }

  /// generiraj sigurno, jedinstveno ime
  const ext = path.extname(slika.name).toLowerCase() || '.jpg';
  const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;

  try {
    await mkdir(UPLOAD_DIR, { recursive: true });
    const buffer = Buffer.from(await slika.arrayBuffer());
    await writeFile(path.join(UPLOAD_DIR, filename), buffer);

    await prisma.zAVRSNI_OSTECENJA.create({
      data: {
        ID_BRODA: id,
        URL_SLIKE: `/ostecenja/${filename}`,
        OPIS: opis ?? null,
        DATUM: new Date(),
      },
    });
  } catch {
    return { ...prevState, message: 'Greška pri spremanju slike.' };
  }

  revalidatePath('/brodovi');
  return { ...prevState, zodErrors: null, message: null };
}

export async function deleteOstecenje(prevState: any, formData: FormData) {
  const idOstecenja = Number(formData.get('idOstecenja'));

  const ostecenje = await prisma.zAVRSNI_OSTECENJA.findUnique({
    where: { ID_OSTECENJA: idOstecenja },
  });

  await prisma.zAVRSNI_OSTECENJA.delete({ where: { ID_OSTECENJA: idOstecenja } });

  /// obriši i lokalnu datoteku ako postoji
  if (ostecenje?.URL_SLIKE) {
    try {
      await unlink(path.join(process.cwd(), 'public', ostecenje.URL_SLIKE));
    } catch {
      // ignoriraj ako datoteka ne postoji
    }
  }

  revalidatePath('/brodovi');
  return { ...prevState, message: null };
}
