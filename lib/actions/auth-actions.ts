'use server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { createSession } from '@/lib/session';

export async function registerUserAction(prevState: any, formData: FormData) {
  const validatedFields = mainSchema.safeParse({
    ime: formData.get('ime'),
    prezime: formData.get('prezime'),
    username: formData.get('username'),
    lozinka: formData.get('lozinka'),
  });

  if (!validatedFields.success) {
    return {
      ...prevState,
      zodErrors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing fields fail',
    };
  }
  const { ime, prezime, username, lozinka } = validatedFields.data;
  const existingUser = await prisma.zAVRSNI_KORISNIK.findUnique({
    where: { USERNAME: username },
  });
  if (existingUser) {
    return {
      ...prevState,
      zodErrors: null,
      message: 'Username je već zauzet',
    };
  }
  const hashedPassword = await bcrypt.hash(lozinka, 10);
  await prisma.zAVRSNI_KORISNIK.create({
    data: {
      IME: ime,
      PREZIME: prezime,
      USERNAME: username,
      LOZINKA: hashedPassword,
    },
  });
  redirect('/signin');
}

export async function signinUserAction(prevState: any, formData: FormData) {
  const validatedFields = signinSchema.safeParse({
    username: formData.get('username'),
    lozinka: formData.get('lozinka'),
  });

  if (!validatedFields.success) {
    return {
      ...prevState,
      zodErrors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing fields fail',
    };
  }

  const { username, lozinka } = validatedFields.data;

  const user = await prisma.zAVRSNI_KORISNIK.findUnique({
    where: { USERNAME: username },
  });

  if (!user) {
    return {
      ...prevState,
      zodErrors: null,
      message: 'Pogrešan username ili lozinka',
    };
  }

  const passwordMatches = await bcrypt.compare(lozinka, user.LOZINKA);

  if (!passwordMatches) {
    return {
      ...prevState,
      zodErrors: null,
      message: 'Pogrešan username ili lozinka',
    };
  }

  await createSession(user.ID_KORISNIK, user.USERNAME);

  redirect('/');
}

const mainSchema = z.object({
  ime: z.string().min(2, 'Ime mora imati barem 2 znaka').max(32, 'Ime je predugačko'),
  prezime: z.string().min(2, 'Prezime mora imati barem 2 znaka').max(32, 'Prezime je predugačko'),
  username: z
    .string()
    .min(3, 'Username mora imati barem 3 znaka')
    .max(32, 'Username je predugačak')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username smije sadržavati samo slova'),
  lozinka: z.string().min(6, 'Lozinka mora imati barem 6 znakova'),
});

const signinSchema = z.object({
  username: z.string().min(1, 'Username je obavezan'),
  lozinka: z.string().min(1, 'Lozinka je obavezna'),
});
