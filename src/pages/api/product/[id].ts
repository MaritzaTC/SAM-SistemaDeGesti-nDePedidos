import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/config/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method === "GET") {
    // Obtener un producto por ID
    const product = await prisma.product.findUnique({
      where: { id: String(id) },
    });
    if (!product)
      return res.status(404).json({ error: "Producto no encontrado" });
    return res.status(200).json(product);
  }

  if (req.method === "PATCH") {
    // Editar un producto
    try {
      const product = await prisma.product.update({
        where: { id: String(id) },
        data: req.body,
      });
      return res.status(200).json(product);
    } catch (error: unknown) {
      return res
        .status(400)
        .json({
          error: error instanceof Error ? error.message : "Error desconocido",
        });
    }
  }

  if (req.method === "DELETE") {
    // Eliminar un producto
    try {
      await prisma.product.delete({ where: { id: String(id) } });
      return res.status(204).end();
    } catch (error: unknown) {
      return res
        .status(400)
        .json({
          error: error instanceof Error ? error.message : "Error desconocido",
        });
    }
  }

  res.setHeader("Allow", ["GET", "PATCH", "DELETE"]);
  res.status(405).end(`Método ${req.method} no permitido`);
}
