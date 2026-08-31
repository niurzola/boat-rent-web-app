'use server';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ZAVRSNI_BROD_STATUS } from '@/generated/prisma/enums';

///validacijska shema za brod
const boatSchema = z.object({
  model: z.string().min(1, 'Model je obavezan'),
  boja: z.string().min(1, 'Boja je obavezna'),
  registracija: z.string().min(1, 'Registracija je obavezna'),
  status: z.enum(ZAVRSNI_BROD_STATUS),
  kategorija: z.string().min(1, 'Odaberi kategoriju'),
});
///funkcija za dodati brod, parsed je shema koja je prosla validaciju
export async function addBoat(prevState: any, formData: FormData) {
  const parsed = boatSchema.safeParse({
    model: formData.get('model'),
    boja: formData.get('boja'),
    registracija: formData.get('registracija'),
    status: formData.get('status'),
    kategorija: formData.get('kategorija'),
  });
  ///safeparse vraca success true/false
  ///ako ne prode validaciju, prikazi error i stani
  if (!parsed.success) {
    return {
      ...prevState,
      zodErrors: parsed.error.flatten().fieldErrors,
      message: 'Provjeri unos',
    };
  }
  /// destrukturiranje da se ne pise parsed.data.model
  const { model, registracija, status, boja, kategorija } = parsed.data;
  const idKategorije = Number(kategorija);
  /// provjera postoji li brod vec u bazi
  const existing = await prisma.zAVRSNI_BROD.findUnique({ where: { REGISTRACIJA: registracija } });

  if (existing) {
    return { ...prevState, zodErrors: { registracija: ['Registracija već postoji'] } };
  }
  ///funkcija za dodat brod u bazu
  await prisma.zAVRSNI_BROD.create({
    data: {
      MODEL_BRODA: model,
      BOJA: boja,
      REGISTRACIJA: registracija,
      STATUS: status,
      ID_KATEGORIJE: idKategorije,
    },
  });
  redirect('/brodovi');
}
