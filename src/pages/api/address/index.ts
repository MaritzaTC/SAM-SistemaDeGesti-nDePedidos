import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/config/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { userId, department, municipality, neighborhood, address, info } =
      req.body;
    try {
      const newAddress = await prisma.address.create({
        data: { userId, department, municipality, neighborhood, address, info },
      });
      return res.status(201).json(newAddress);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      return res.status(400).json({ error: errorMessage });
    }
  }

  if (req.method === "GET") {
    // Puedes filtrar por usuario si lo deseas: ?userId=xxx
    const { userId } = req.query;
    const addresses = await prisma.address.findMany({
      where: userId ? { userId: String(userId) } : {},
    });
    return res.status(200).json(addresses);
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Método ${req.method} no permitido`);
}
