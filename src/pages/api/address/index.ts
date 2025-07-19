import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { options } from "@/pages/api/auth/[...nextauth]";
import prisma from "@/config/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, options);

  if (!session || !session.user?.email) {
    return res.status(401).json({ message: "No autorizado" });
  }

  if (req.method === "POST") {
    const { department, municipality, neighborhood, address, info } = req.body;

    // Validar campos obligatorios
    if (!department || !municipality || !neighborhood || !address) {
      return res.status(400).json({ message: "Campos requeridos faltantes" });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });

      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      const newAddress = await prisma.address.create({
        data: {
          userId: user.id,
          department,
          municipality,
          neighborhood,
          address,
          info,
        },
      });

      return res.status(201).json({ message: "Dirección guardada", address: newAddress });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return res.status(500).json({ message: err.message || "Error interno" });
    }
  }

  res.setHeader("Allow", ["POST"]);
  return res.status(405).end(`Método ${req.method} no permitido`);
}
