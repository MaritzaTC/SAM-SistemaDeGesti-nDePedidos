// pages/admin/dashboard.tsx

import { DashboardLayout } from "@/components/admin/DashboardLayout";
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, AwaitedReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Shield, ShoppingCart, TrendingUp } from "lucide-react";
import { useSession } from "next-auth/react";
const index = () => {
    const { data: session, status } = useSession();
  
    if (status === "loading") {
      return <p className="text-center mt-20">Cargando sesión...</p>;
    }
  
    type UserWithRole = {
      id?: string | number;
      address: string;
      role?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      firstName?: string | null;
    };
  
    // Extend session user type to include 'id'
    const user = session?.user as UserWithRole & { id?: string | number };
  
    if (user?.role !== "ADMIN" && user?.role !== "EMPLEADO") {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground">Acceso Denegado</h3>
            <p className="text-muted-foreground">
              No tienes permisos para acceder a esta sección.
            </p>
          </div>
        </div>
      );
    }
  return <div>

 <div className="container mx-auto px-4 py-8 space-y-6">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Bienvenido, {user?.name}. Aquí tienes un resumen de tu tienda.
        </p>
      </div>

    {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>
            Tareas comunes para gestionar tu tienda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-auto p-4 flex flex-col items-center space-y-2">
              <Package className="h-6 w-6" />
              <span>Agregar Producto</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <ShoppingCart className="h-6 w-6" />
              <span>Crear Pedido</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <TrendingUp className="h-6 w-6" />
              <span>Ver Reportes</span>
            </Button>
          </div>
        </CardContent>
      </Card>
  </div>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
index.getLayout = (page: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined) => <DashboardLayout>{page}</DashboardLayout>;

export default index;
