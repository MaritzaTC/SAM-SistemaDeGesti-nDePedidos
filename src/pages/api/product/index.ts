import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/config/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    // Listar todos los productos
    const products = await prisma.product.findMany();
    return res.status(200).json(products);
  }

  if (req.method === "POST") {
    // Crear un producto
    const { name, category, price, discount, image, isNew, stock } = req.body;
    try {
      const product = await prisma.product.create({
        data: { name, category, price, discount, image, isNew, stock },
      });
      return res.status(201).json(product);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(400).json({ error: "Unknown error occurred" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Método ${req.method} no permitido`);
}
