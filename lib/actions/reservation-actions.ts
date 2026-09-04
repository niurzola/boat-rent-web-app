'use server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

const reservationSchema = z.object({
  brodId: z.coerce.number().int().positive(),
  datum: z.string().min(1),
  vrijemeOd: z.string().regex(/^\d{2}:\d{2}$/),
  vrijemeDo: z.string().regex(/^\d{2}:\d{2}$/),
  ime: z.string().min(1, 'Ime je obavezno'),
  prezime: z.string().min(1, 'Prezime je obavezno'),
  telefon: z.string().optional(),
  napomena: z.string().optional(),
  depozit: z.coerce.number().min(0),
  komentar: z.string().optional(),
});

const updateReservationSchema = reservationSchema.extend({
  idRezervacije: z.coerce.number().int().positive(),
  idKlijenta: z.coerce.number().int().positive(),
});

function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

export async function createReservation(prevState: any, formData: FormData) {
  const parsed = reservationSchema.safeParse({
    brodId: formData.get('brodId'),
    datum: formData.get('datum'),
    vrijemeOd: formData.get('vrijemeOd'),
    vrijemeDo: formData.get('vrijemeDo'),
    ime: formData.get('ime'),
    prezime: formData.get('prezime'),
    telefon: formData.get('telefon'),
    napomena: formData.get('napomena'),
    depozit: formData.get('depozit'),
    komentar: formData.get('komentar'),
  });

  if (!parsed.success) {
    return {
      ...prevState,
      zodErrors: z.flattenError(parsed.error).fieldErrors,
      message: 'Provjeri unos',
    };
  }

  const {
    brodId,
    datum,
    vrijemeOd,
    vrijemeDo,
    ime,
    prezime,
    telefon,
    napomena,
    depozit,
    komentar,
  } = parsed.data;

  const session = await getSession();
  if (!session) {
    return { ...prevState, message: 'Niste prijavljeni' };
  }

  const odMin = timeToMinutes(vrijemeOd);
  const doMin = timeToMinutes(vrijemeDo);

  if (odMin >= doMin) {
    return { ...prevState, message: 'Vrijeme završetka mora biti nakon početka' };
  }

  const datumDate = new Date(datum);

  const existingReservations = await prisma.zAVRSNI_REZERVACIJA.findMany({
    where: { ID_BRODA: brodId, DATUM: datumDate },
    select: { VRIJEME: true, VRIJEME_KRAJA: true },
  });

  for (const r of existingReservations) {
    const existOd = timeToMinutes(r.VRIJEME.toTimeString().slice(0, 5));
    const existDo = r.VRIJEME_KRAJA
      ? timeToMinutes(r.VRIJEME_KRAJA.toTimeString().slice(0, 5))
      : existOd + 60;

    if (odMin < existDo && doMin > existOd) {
      return { ...prevState, message: 'Vremenski termin se preklapa s postojećom rezervacijom' };
    }
  }

  const brod = await prisma.zAVRSNI_BROD.findUnique({
    where: { ID_BRODA: brodId },
    include: { ZAVRSNI_KATEGORIJA: { include: { ZAVRSNI_CIJENA: true } } },
  });

  if (!brod) {
    return { ...prevState, message: 'Brod nije pronađen' };
  }

  const trajanjeSati = (doMin - odMin) / 60;
  const cijenaEntry = brod.ZAVRSNI_KATEGORIJA?.ZAVRSNI_CIJENA.find(
    (c) => c.TRAJANJE_NAJMA === Math.floor(trajanjeSati)
  );

  if (!cijenaEntry) {
    return { ...prevState, message: 'Nije pronađena cijena za traženo trajanje' };
  }

  const client = await prisma.zAVRSNI_KLIJENT.create({
    data: {
      IME: ime,
      PREZIME: prezime,
      TELEFON: telefon || null,
      NAPOMENA: napomena || null,
    },
  });

  const [odH, odM] = vrijemeOd.split(':').map(Number);
  const [doH, doM] = vrijemeDo.split(':').map(Number);

  const vrijemeOdDate = new Date(datumDate);
  vrijemeOdDate.setHours(odH, odM, 0, 0);

  const vrijemeDoDate = new Date(datumDate);
  vrijemeDoDate.setHours(doH, doM, 0, 0);

  await prisma.zAVRSNI_REZERVACIJA.create({
    data: {
      ID_BRODA: brodId,
      ID_KLIJENTA: client.ID_KLIJENTA,
      ID_KORISNIK: session.userId as number,
      ID_CIJENE: cijenaEntry.ID_CIJENE,
      DATUM: datumDate,
      VRIJEME: vrijemeOdDate,
      VRIJEME_KRAJA: vrijemeDoDate,
      DEPOZIT: depozit,
      UKUPNA_CIJENA: cijenaEntry.CIJENA,
      KOMENTAR: komentar || null,
    },
  });

  return { ...prevState, message: null, success: true };
}
export async function updateReservation(prevState: any, formData: FormData) {
  const parsed = updateReservationSchema.safeParse({
    idRezervacije: formData.get('idRezervacije'),
    idKlijenta: formData.get('idKlijenta'),
    brodId: formData.get('brodId'),
    datum: formData.get('datum'),
    vrijemeOd: formData.get('vrijemeOd'),
    vrijemeDo: formData.get('vrijemeDo'),
    ime: formData.get('ime'),
    prezime: formData.get('prezime'),
    telefon: formData.get('telefon'),
    napomena: formData.get('napomena'),
    depozit: formData.get('depozit'),
    komentar: formData.get('komentar'),
  });

  if (!parsed.success) {
    return {
      ...prevState,
      zodErrors: z.flattenError(parsed.error).fieldErrors,
      message: 'Provjeri unos',
    };
  }

  const {
    idRezervacije,
    idKlijenta,
    brodId,
    datum,
    vrijemeOd,
    vrijemeDo,
    ime,
    prezime,
    telefon,
    napomena,
    depozit,
    komentar,
  } = parsed.data;

  const session = await getSession();
  if (!session) {
    return { ...prevState, message: 'Niste prijavljeni' };
  }

  const odMin = timeToMinutes(vrijemeOd);
  const doMin = timeToMinutes(vrijemeDo);

  if (odMin >= doMin) {
    return { ...prevState, message: 'Vrijeme završetka mora biti nakon početka' };
  }

  const datumDate = new Date(datum);

  const existingReservations = await prisma.zAVRSNI_REZERVACIJA.findMany({
    where: { ID_BRODA: brodId, DATUM: datumDate, NOT: { ID_REZERVACIJE: idRezervacije } },
    select: { VRIJEME: true, VRIJEME_KRAJA: true },
  });

  for (const r of existingReservations) {
    const existOd = timeToMinutes(r.VRIJEME.toTimeString().slice(0, 5));
    const existDo = r.VRIJEME_KRAJA
      ? timeToMinutes(r.VRIJEME_KRAJA.toTimeString().slice(0, 5))
      : existOd + 60;

    if (odMin < existDo && doMin > existOd) {
      return { ...prevState, message: 'Vremenski termin se preklapa s postojećom rezervacijom' };
    }
  }

  const brod = await prisma.zAVRSNI_BROD.findUnique({
    where: { ID_BRODA: brodId },
    include: { ZAVRSNI_KATEGORIJA: { include: { ZAVRSNI_CIJENA: true } } },
  });

  if (!brod) {
    return { ...prevState, message: 'Brod nije pronađen' };
  }

  const trajanjeSati = (doMin - odMin) / 60;
  const cijenaEntry = brod.ZAVRSNI_KATEGORIJA?.ZAVRSNI_CIJENA.find(
    (c) => c.TRAJANJE_NAJMA === Math.floor(trajanjeSati)
  );

  if (!cijenaEntry) {
    return { ...prevState, message: 'Nije pronađena cijena za traženo trajanje' };
  }

  const [odH, odM] = vrijemeOd.split(':').map(Number);
  const [doH, doM] = vrijemeDo.split(':').map(Number);

  const vrijemeOdDate = new Date(datumDate);
  vrijemeOdDate.setHours(odH, odM, 0, 0);

  const vrijemeDoDate = new Date(datumDate);
  vrijemeDoDate.setHours(doH, doM, 0, 0);

  await prisma.$transaction([
    prisma.zAVRSNI_KLIJENT.update({
      where: { ID_KLIJENTA: idKlijenta },
      data: {
        IME: ime,
        PREZIME: prezime,
        TELEFON: telefon || null,
        NAPOMENA: napomena || null,
      },
    }),
    prisma.zAVRSNI_REZERVACIJA.update({
      where: { ID_REZERVACIJE: idRezervacije },
      data: {
        ID_BRODA: brodId,
        ID_CIJENE: cijenaEntry.ID_CIJENE,
        DATUM: datumDate,
        VRIJEME: vrijemeOdDate,
        VRIJEME_KRAJA: vrijemeDoDate,
        DEPOZIT: depozit,
        UKUPNA_CIJENA: cijenaEntry.CIJENA,
        KOMENTAR: komentar || null,
      },
    }),
  ]);

  return { ...prevState, message: null, success: true };
}

export async function deleteReservation(prevState: any, formData: FormData) {
  const idRezervacije = Number(formData.get('idRezervacije'));

  if (Number.isNaN(idRezervacije) || idRezervacije <= 0) {
    return { ...prevState, message: 'Neispravan id rezervacije' };
  }

  const reservation = await prisma.zAVRSNI_REZERVACIJA.findUnique({
    where: { ID_REZERVACIJE: idRezervacije },
    select: { ID_KLIJENTA: true },
  });

  if (!reservation) {
    return { ...prevState, message: 'Rezervacija ne postoji' };
  }

  await prisma.$transaction([
    prisma.zAVRSNI_REZERVACIJA.delete({
      where: { ID_REZERVACIJE: idRezervacije },
    }),
    prisma.zAVRSNI_KLIJENT.deleteMany({
      where: {
        ID_KLIJENTA: reservation.ID_KLIJENTA,
        NOT: { ZAVRSNI_REZERVACIJA: { some: { ID_REZERVACIJE: { not: idRezervacije } } } },
      },
    }),
  ]);

  return { ...prevState, message: null, success: true };
}
