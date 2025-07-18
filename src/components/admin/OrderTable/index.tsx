import React, { useEffect, useState } from "react";
import OrderFilters from "./OrderFilters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";

const statusOptions = [
  { label: "Pendiente", value: "PENDING" },
  { label: "Completado", value: "COMPLETED" },
  { label: "Cancelado", value: "CANCELED" },
];

type Order = {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  total: number;
  tax: number;
  subtotal: number;
  client: { name: string; email: string };
};

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELED: "bg-red-100 text-red-800",
};

const OrderTable: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await fetch("/api/order");
      const data = await res.json();
      setOrders(data);
      setFilteredOrders(data);
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    let filtered = orders;
    if (statusFilter !== "ALL") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }
    if (search) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(search.toLowerCase()) ||
          order.client.name.toLowerCase().includes(search.toLowerCase()) ||
          order.client.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredOrders(filtered);
  }, [statusFilter, search, orders]);

  // Nueva función para actualizar el estado
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/order/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        // Actualiza el estado localmente
        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
      }
    } catch (error) {
      console.error("Error al actualizar el estado del pedido:", error);
      alert("Error al actualizar el estado del pedido");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pedidos ({filteredOrders.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <OrderFilters
          status={statusFilter}
          setStatus={setStatusFilter}
          search={search}
          setSearch={setSearch}
        />
        <div className="overflow-x-auto mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center text-muted-foreground"
                  >
                    No se encontraron pedidos.
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono">{order.id}</TableCell>
                    <TableCell>{order.client?.name}</TableCell>
                    <TableCell>{order.client?.email}</TableCell>
                    <TableCell>
                      <select
                        className={`rounded px-2 py-1 ${
                          statusColors[order.status] || ""
                        }`}
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {order.total.toLocaleString("es-CO", {
                        style: "currency",
                        currency: "COP",
                        minimumFractionDigits: 0,
                      })}
                    </TableCell>
                    <TableCell>
                      {/* Aquí puedes poner botones de ver/editar/eliminar */}
                      <button className="text-primary hover:underline">
                        Ver
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderTable;
