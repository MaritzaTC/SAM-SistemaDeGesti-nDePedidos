import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/config/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    // Permite filtrar por email de cliente
    const { email } = req.query;
    let where = {};
    if (email) {
      where = { client: { email: String(email) } };
    }
    const orders = await prisma.order.findMany({
      where,
      include: {
        client: true,
        items: { include: { product: true } },
        payment: true,
        receipt: true,
      },
    });
    return res.status(200).json(orders);
  }

  if (req.method === "POST") {
    // Crear un pedido
    const { idClient, items, total, tax, subtotal, status } = req.body;
    try {
      const order = await prisma.order.create({
        data: {
          idClient,
          status,
          total,
          tax,
          subtotal,
          items: {
            create: items, // items debe ser un array de objetos con idProduct, quantity, price
          },
        },
        include: { items: true },
      });
      return res.status(201).json(order);
    } catch (error: unknown) {
      let message = "Unknown error";
      if (error instanceof Error) {
        message = error.message;
      }
      return res.status(400).json({ error: message });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Método ${req.method} no permitido`);
}
