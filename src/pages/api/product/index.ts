/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { options } from "@/pages/api/auth/[...nextauth]";
import prisma from "@/config/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  
  if (req.method === "GET") {
  try {
    const products = await prisma.product.findMany();
    return res.status(200).json(products);
  } catch (err: any) {
    return res.status(500).json({ message: err.message || "Error interno del servidor" });
  }
}

  const session = await getServerSession(req, res, options);

  type SessionUser = {
    role?: string | null;
    email?: string | null;
    name?: string | null;
  };

  const user = session?.user as SessionUser;

  if (!session || (user.role !== "ADMIN" && user.role !== "EMPLEADO")) {
    return res.status(403).json({ message: "No autorizado" });
  }

  if (req.method === "GET") {
    try {
      const products = await prisma.product.findMany();
      return res.status(200).json(products);
    } catch (err: any) {
      return res.status(500).json({ message: err.message || "Error interno del servidor" });
    }
  }

  if (req.method === "POST") {
    const { name, category, price, discount, image, isNew, stock } = req.body;

    if (!name || !category || !price || !image || stock === undefined) {
      return res.status(400).json({ message: "Campos requeridos faltantes" });
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

      return res.status(201).json({ message: "Producto creado", product });
    } catch (err: any) {
      return res.status(500).json({ message: err.message || "Error al crear producto" });
    }
  }

  if (req.method === "PATCH") {
    const { id, ...updates } = req.body;

    if (!id) {
      return res.status(400).json({ message: "ID del producto es requerido" });
    }

    try {
      const updatedProduct = await prisma.product.update({
        where: { id },
        data: updates,
      });

      return res.status(200).json({ message: "Producto actualizado", product: updatedProduct });
    } catch (err: any) {
      return res.status(500).json({ message: err.message || "Error al actualizar producto" });
    }
  }

  if (req.method === "DELETE") {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "ID del producto es requerido" });
    }

    try {
      await prisma.product.delete({
        where: { id },
      });

      return res.status(200).json({ message: "Producto eliminado" });
    } catch (err: any) {
      return res.status(500).json({ message: err.message || "Error al eliminar producto" });
    }
  }
  res.setHeader("Allow", ["GET", "POST", "PATCH", "DELETE"]);
  return res.status(405).end(`Método ${req.method} no permitido`);
}
