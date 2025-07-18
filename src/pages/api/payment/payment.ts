// filepath: src/pages/api/payment.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { options as authOptions } from "../auth/[...nextauth]"; // Asegúrate de que la ruta es correcta

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // ✅ Verificar sesión del usuario
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "No autorizado. Inicia sesión primero." });
  }

  if (req.method === "POST") {
    const { amount, currency } = req.body;
    try {
      const stripeSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: currency || "cop",
              product_data: { name: "Pedido SAM" },
              unit_amount: amount,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${req.headers.origin}/admin/payment/success`,
        cancel_url: `${req.headers.origin}/admin/payment/cancel`,
      });
      res.status(200).json({ url: stripeSession.url });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end("Método no permitido");
  }
}
