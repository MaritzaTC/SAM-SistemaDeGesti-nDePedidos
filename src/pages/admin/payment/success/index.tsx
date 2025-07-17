import React from "react";
import Link from "next/link";

const SuccessPage = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-green-50">
    <h1 className="text-3xl font-bold text-green-700 mb-4">¡Pago exitoso!</h1>
    <p className="text-lg text-green-800 mb-6">Gracias por tu compra. Pronto recibirás tu pedido.</p>
    <Link href="/" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Volver al inicio</Link>
  </div>
);

export default SuccessPage;