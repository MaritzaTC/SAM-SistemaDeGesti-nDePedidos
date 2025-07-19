import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { options } from "@/pages/api/auth/[...nextauth]";
import prisma from "@/config/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, options);

  if (!session || !session.user?.email) {
    return res.status(401).json({ message: "No autorizado" });
  }

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  try {
    const orders = await prisma.order.findMany({
      select: {
        id: true,
        createdAt: true,
        total: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error al obtener las órdenes", error);
    res.status(500).json({ message: "Error del servidor" });
  }
}
