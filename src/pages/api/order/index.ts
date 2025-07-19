/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { options } from "@/pages/api/auth/[...nextauth]";
import prisma from "@/config/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, options);

  if (!session || !session.user?.email) {
    return res.status(401).json({ message: "No autorizado" });
  }

  if (req.method === "POST") {
    const { items, subtotal, tax, total } = req.body;

    if (!items || !subtotal || !total) {
      return res.status(400).json({ message: "Faltan datos de la orden" });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });

      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      // Crear orden
      console.log("📦 Items recibidos:", items);

      const newOrder = await prisma.order.create({
        data: {
          userId: user.id,
          subtotal,
          total,
          tax,
          items: {
            create: items.map((item: any) => ({
              idProduct: item.id,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: {
          items: true,
        },
      });
for (const item of items) {
  await prisma.product.update({
    where: { id: item.id },
    data: {
      stock: {
        decrement: item.quantity, // resta el stock vendido
      },
    },
  });
}
      return res.status(201).json({ message: "Orden creada", order: newOrder });
    } catch (err: any) {
      return res.status(500).json({ message: err.message || "Error interno" });
    }
  }

  if (req.method === "GET") {
    const { userId } = req.query;
    let where = {};
    if (userId) {
      where = { userId: String(userId) };
    }
    const orders = await prisma.order.findMany({
      where,
      include: {
        user: true,
        items: { include: { product: true } },
        payment: true,
        receipt: true,
      },
    });
    return res.status(200).json(orders);
  }

  return res.status(405).end(`Método ${req.method} no permitido`);
}
