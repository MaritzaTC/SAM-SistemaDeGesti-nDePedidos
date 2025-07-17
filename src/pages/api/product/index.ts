
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from "@/config/prisma";
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name, category, price, discount, image, isNew, stock } = req.body;

   
    if (!name || !category || !price || !image || stock === undefined) {
      return res.status(400).json({ error: 'Campos requeridos faltantes' });
    }

    try {
      const product = await prisma.product.create({
        data: {
          name,
          category, 
          price,
          discount,
          image,
          isNew,
          stock,
        },
      });

      return res.status(201).json(product);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(400).json({ error: 'Error desconocido' });
    }
  } else {
    return res.status(405).json({ error: 'Método no permitido' });
  }
}
