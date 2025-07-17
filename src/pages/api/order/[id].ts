import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/config/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method === "GET") {
    // Obtener un pedido por ID
    const order = await prisma.order.findUnique({
      where: { id: String(id) },
      include: { client: true, items: true, payment: true, receipt: true },
    });
    if (!order) return res.status(404).json({ error: "Pedido no encontrado" });
    return res.status(200).json(order);
  }

  if (req.method === "PATCH") {
    // Editar un pedido
    try {
      const data = req.body;
      const order = await prisma.order.update({
        where: { id: String(id) },
        data,
      });
      return res.status(200).json(order);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      return res.status(400).json({ error: errorMessage });
    }
  }

  if (req.method === "DELETE") {
    // Eliminar un pedido
    try {
      await prisma.order.delete({ where: { id: String(id) } });
      return res.status(204).end();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      return res.status(400).json({ error: errorMessage });
    }
  }

  res.setHeader("Allow", ["GET", "PATCH", "DELETE"]);
  res.status(405).end(`Método ${req.method} no permitido`);
}
