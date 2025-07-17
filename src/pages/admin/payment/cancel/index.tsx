import React from "react";
import Link from "next/link";

const CancelPage = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-red-50">
    <h1 className="text-3xl font-bold text-red-700 mb-4">Pago cancelado</h1>
    <Link href="/" className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Volver al inicio</Link>
    <Link href="/" className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Volver al inicio</Link>
  </div>
);

export default CancelPage;