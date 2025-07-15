/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth, { NextAuthOptions } from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/config/prisma";

// Configuración de NextAuth
const options: NextAuthOptions = {
  // Adaptador Prisma para persistencia en la base de datos
  adapter: PrismaAdapter(prisma),

  // Proveedores de autenticación
  providers: [
    Auth0Provider({
      wellKnown: `https://${process.env.AUTH0_DOMAIN}/`,
      issuer: process.env.AUTH0_DOMAIN,
      authorization: `https://${process.env.AUTH0_DOMAIN}/authorize?response_type=code&prompt=login`,
      clientId: process.env.AUTH0_CLIENT_ID || "",
      clientSecret: process.env.AUTH0_CLIENT_SECRET || "",
    }),
  ],

  // Callbacks para personalizar la sesión
  callbacks: {
    async session({ session, user }) {
      const newSession = (await prisma.session.findFirst({
        where: {
          userId: user.id,
        },
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      })) as any;
      return {
        ...session,
        user: {
          ...newSession?.user,
          role: newSession?.user?.role, // El rol será visible en la sesión
        },
        token: newSession?.sessionToken,
      };
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
