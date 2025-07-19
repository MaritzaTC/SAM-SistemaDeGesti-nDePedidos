// pages/admin/dashboard.tsx

import { DashboardLayout } from "@/components/admin/DashboardLayout";
import OrderTable from "@/components/admin/OrderTable";
import { useSession } from "next-auth/react";
import { ReactElement } from "react";

export default function OrdersPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="text-center mt-20">Cargando sesión...</div>;
  }

  if (!session) {
    return (
      <div className="text-center mt-20">
        Debes iniciar sesión para ver los pedidos.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Pedidos</h1>
      <p className="text-muted-foreground mb-6">
        Gestiona y revisa todos los pedidos realizados en la tienda.
      </p>
      <OrderTable />
    </div>
  );
}

OrdersPage.getLayout = (page: ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);
