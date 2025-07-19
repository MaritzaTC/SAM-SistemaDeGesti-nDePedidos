"use client";
import { DashboardLayout } from "@/components/admin/DashboardLayout";
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, AwaitedReactNode } from "react";

import { useEffect, useState } from "react";

type Orden = {
  id: string;
  createdAt: string;
  total: number;
};

export default function Index() {
  const [ordenes, setOrdenes] = useState<Orden[]>([]);

  useEffect(() => {
    const fetchOrdenes = async () => {
      try {
        const res = await fetch("/api/transactions", );
        const data = await res.json();
        setOrdenes(data);
      } catch (error) {
        console.error("Error al cargar las transaciones ", error);
      }
    };

    fetchOrdenes();
  }, []);

  return (
    <div className="min-h-screen bg-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Transaciones</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-2 border-b">ID</th>
                <th className="text-left px-4 py-2 border-b">Fecha</th>
                <th className="text-left px-4 py-2 border-b">Total</th>
              </tr>
            </thead>
            <tbody>
              {ordenes.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center px-4 py-6 text-gray-500">
                    No hay órdenes registradas
                  </td>
                </tr>
              ) : (
                ordenes.map((orden) => (
                  <tr key={orden.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-2 border-b">{orden.id}</td>
                    <td className="px-4 py-2 border-b">
                      {new Date(orden.createdAt).toLocaleString("es-CO", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </td>
                    <td className="px-4 py-2 border-b font-semibold text-blue-700">
                      {new Intl.NumberFormat("es-CO", {
                        style: "currency",
                        currency: "COP",
                      }).format(orden.total)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
Index.getLayout = (page: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined) => <DashboardLayout>{page}</DashboardLayout>;

