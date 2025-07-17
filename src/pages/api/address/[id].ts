import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/config/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method === "GET") {
    const address = await prisma.address.findUnique({
      where: { id: String(id) },
    });
    if (!address)
      return res.status(404).json({ error: "Dirección no encontrada" });
    return res.status(200).json(address);
  }

  if (req.method === "PATCH") {
    try {
      const address = await prisma.address.update({
        where: { id: String(id) },
        data: req.body,
      });
      return res.status(200).json(address);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      return res.status(400).json({ error: errorMessage });
    }
  }

  if (req.method === "DELETE") {
    try {
      await prisma.address.delete({ where: { id: String(id) } });
      return res.status(204).end();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      return res.status(400).json({ error: errorMessage });
    }
  }

  res.setHeader("Allow", ["GET", "PATCH", "DELETE"]);
  res.status(405).end(`Método ${req.method} no permitido`);
}
