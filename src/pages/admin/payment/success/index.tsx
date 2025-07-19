"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle } from "lucide-react";


const SuccessPage = () => {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const saveOrder = async () => {
      const stored = sessionStorage.getItem("order_data");
      if (!stored) return;

      try {
        const orderData = JSON.parse(stored);
        const res = await fetch("/api/order/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...orderData,
            paymentData: { stripe: "Pago exitoso" }, // Aquí podrías poner response real de Stripe Webhook si lo usas
          }),
        });

        if (res.ok) {
          setSaved(true);
          sessionStorage.removeItem("order_data");
        } else {
          console.error("❌ No se pudo guardar la orden");
        }
      } catch (err) {
        console.error("❌ Error al procesar SuccessPage:", err);
      }
    };

    saveOrder();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center animate-fade-in w-full max-w-md">
        <CheckCircle className="mx-auto text-green-600 mb-4" size={64} />
        <h1 className="text-3xl font-extrabold text-green-700 mb-2">¡Pago exitoso!</h1>
        <p className="text-base text-gray-700 mb-6">
          {saved
            ? "Gracias por tu compra. Pronto recibirás tu pedido."
            : "Procesando tu pedido..."}
        </p>
        <Link
          href="/"
          className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default SuccessPage;
