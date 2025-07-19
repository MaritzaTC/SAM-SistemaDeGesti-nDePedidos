/* eslint-disable @typescript-eslint/no-unused-vars */

import NextAuth, { NextAuthOptions } from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/config/prisma";

import type { AdapterUser } from "next-auth/adapters";

// Extiende AdapterUser para incluir 'role'
declare module "next-auth/adapters" {
  interface AdapterUser {
    role?: string;
  }
}

// Configuración de NextAuth
const options: NextAuthOptions = {
  // Adaptador Prisma para persistencia en la base de datos
  adapter: PrismaAdapter(prisma),

  // Proveedores de autenticación
  providers: [
    Auth0Provider({
      issuer: `https://${process.env.AUTH0_DOMAIN}`,
      clientId: process.env.AUTH0_CLIENT_ID || "",
      clientSecret: process.env.AUTH0_CLIENT_SECRET || "",
      authorization: {
        params: {
          response_type: "code",
          prompt: "login",
          connection: "Username-Password-Authentication",
        },
      },
    }),
  ],

  // Callbacks para personalizar la sesión
  callbacks: {
    async session({ session, user }) {
      return {
        ...session,
        user: {
          ...session.user, // incluye name, email, image
          id: user.id, // agrega el id del usuario
          role: user.role, // agrega el rol desde la base de datos
        },
      };
    },

    async redirect({ baseUrl }) {
      return `${baseUrl}/`;
    },
  },
  events: {
    async signIn({ user }) {
      // Si no tiene rol, le asignamos CLIENTE por defecto
      const existingUser = await prisma.user.findUnique({
        where: { id: user.id },
      });

      if (existingUser && !existingUser.role) {
        await prisma.user.update({
          where: { id: user.id },
          data: { role: "CLIENTE" },
        });
      }
    },
  },

  // Secreto para cifrado de tokens
  secret: process.env.AUTH0_CLIENT_SECRET,
};

// Exporta la configuración y el handler de NextAuth
import type { NextApiRequest, NextApiResponse } from "next";

const nextAuthHandler = (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, options);

export default nextAuthHandler;
export { options };
