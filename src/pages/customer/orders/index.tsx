import React from "react";
import { useSession } from "next-auth/react";
import OrdersList from "@/components/client/Orders/OrdersList";

export default function OrdersPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="text-center mt-20">Cargando sesión...</div>;
  }

  if (!session) {
    return (
      <div className="text-center mt-20">
        Debes iniciar sesión para ver tus pedidos.
      </div>
    );
  }

  // Si el usuario no tiene email, muestra un mensaje, pero no lances error
  const userEmail = session.user?.email || "";

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Mis Pedidos</h1>
      <p className="text-muted-foreground mb-6">
        Consulta el estado y detalles de tus compras.
      </p>
      <OrdersList userEmail={userEmail} />
    </div>
  );
}
