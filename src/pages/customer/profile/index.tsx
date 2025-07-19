
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';

import prisma from '@/config/prisma';
import { options } from '@/pages/api/auth/[...nextauth]';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, options);

  if (!session || !session.user?.email) {
    return res.status(401).json({ message: 'No autorizado' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        name: true,
        email: true,
        role: true,
        lastName: true,
        phone: true,
        image: true,
        documentType: true,
        documentNumber: true,
      },
    });

    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    return res.status(200).json(user);
  } catch (err: any) {
    console.error('Error obteniendo perfil:', err);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}