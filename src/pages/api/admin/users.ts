/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { options } from "@/pages/api/auth/[...nextauth]";
import prisma from "@/config/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    type SessionUser = {
        name?: string | null;
        email?: string | null;
        image?: string | null;
        role?: string | null;
        address?: string;
    };
    const session = await getServerSession(req, res, options) as { user?: SessionUser };


    if (!session || session.user?.role !== "ADMIN") {
        return res.status(403).json({ message: "No autorizado" });
    }

    if (req.method === "POST") {
        const { name, email, password, role = "EMPLEADO" } = req.body;

        try {
            // 1. Obtener token de acceso de la Management API
            const tokenRes = await fetch(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    grant_type: "client_credentials",
                    client_id: process.env.AUTH0_CLIENT_ID,
                    client_secret: process.env.AUTH0_CLIENT_SECRET,
                    audience: process.env.AUTH0_MANAGEMENT_API_AUDIENCE,
                }),
            });

            const tokenData = await tokenRes.json();

            if (!tokenRes.ok) {
                throw new Error(tokenData.error_description || tokenData.error || "Error al obtener token de Auth0");
            }

            const accessToken = tokenData.access_token;

            // 2. Crear usuario en Auth0
            const userRes = await fetch(`https://${process.env.AUTH0_DOMAIN}/api/v2/users`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    username: name,
                    password,
                    connection: "Username-Password-Authentication",
                    email_verified: false,
                }),
            });

            const userData = await userRes.json();

            if (!userRes.ok) {
                return res.status(400).json({ message: userData.message || "Error al crear usuario" });
            }

            // 3. Guardar usuario en tu base de datos (opcional)
            const createdUser = await prisma.user.create({
                data: {
                    name,
                    email,
                    role,
                    accounts: {
                        create: {
                            type: "oauth",
                            provider: "auth0",
                            providerAccountId: userData.user_id, // este viene de Auth0 (userData.user_id)
                        },
                    },
                },
            });


            return res.status(201).json({ message: "Usuario creado exitosamente", user: createdUser });
        } catch (err: any) {
            console.error("Error al crear usuario:", err);
            return res.status(500).json({ message: err.message || "Error interno del servidor" });
        }
    }
    if (req.method === "GET") {
        try {
            const users = await prisma.user.findMany({
                select: {
                    email: true,
                    phone: true,
                    documentType: true,
                    name: true,
                    image: true,
                    lastName: true,
                    documentNumber: true,
                    role: true,
                    createdAt: true,
                }
            });
            return res.status(200).json(users);
        } catch (err: any) {
            return res.status(500).json({ message: err.message || "Error interno del servidor" });
        }
    }

// EDIT A USER
if (req.method === "PATCH") {
  const {
    email,
    role,
    name,
    lastName,
    phone,
    documentType,
    documentNumber,
   image,
  } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email es requerido" });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        ...(role && { role }),
        ...(name && { name }),
        ...(lastName && { lastName }),
        ...(phone && { phone }),
        ...(documentType && { documentType }),
        ...(documentNumber && { documentNumber }),
        ...(image && { image }),
      },
    });

    return res.status(200).json({
      message: "Usuario actualizado exitosamente",
      user: updatedUser,
    });
  } catch (err: any) {
    console.error("Error al actualizar usuario:", err);
    return res
      .status(500)
      .json({ message: err.message || "Error interno del servidor" });
  }
}



    res.setHeader("Allow", ["POST", "GET","PATCH"]);
    return res.status(405).end(`Método ${req.method} no permitido`);
}
