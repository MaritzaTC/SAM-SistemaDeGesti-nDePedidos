// import React, { useEffect, useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Table,
//   TableHead,
//   TableHeader,
//   TableRow,
//   TableBody,
//   TableCell,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import OrderDetail from "./OrderDetail";

// type Order = {
//   id: string;
//   status: string;
//   createdAt: string;
//   total: number;
//   tax: number;
//   subtotal: number;
//   client: { name: string; email: string };
//   items: {
//     id: string;
//     product: { name: string; image: string };
//     quantity: number;
//     price: number;
//   }[];
// };

// const statusColors: Record<string, string> = {
//   PENDING: "bg-yellow-100 text-yellow-800",
//   COMPLETED: "bg-green-100 text-green-800",
//   CANCELED: "bg-red-100 text-red-800",
// };

// const OrdersList: React.FC<{ userEmail: string }> = ({ userEmail }) => {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       // Puedes crear un endpoint /api/customer/orders?email=... o filtrar en frontend
//       const res = await fetch("/api/order");
//       const data = await res.json();
//       // Filtra solo los pedidos del cliente autenticado
//       setOrders(
//         data.filter((order: Order) => order.client?.email === userEmail)
//       );
//     };
//     fetchOrders();
//   }, [userEmail]);

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Mis Pedidos ({orders.length})</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="overflow-x-auto">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>ID</TableHead>
//                 <TableHead>Fecha</TableHead>
//                 <TableHead>Estado</TableHead>
//                 <TableHead>Total</TableHead>
//                 <TableHead>Acciones</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {orders.length === 0 ? (
//                 <TableRow>
//                   <TableCell
//                     colSpan={5}
//                     className="text-center text-muted-foreground"
//                   >
//                     No tienes pedidos registrados.
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 orders.map((order) => (
//                   <TableRow key={order.id}>
//                     <TableCell className="font-mono">{order.id}</TableCell>
//                     <TableCell>
//                       {new Date(order.createdAt).toLocaleDateString()}
//                     </TableCell>
//                     <TableCell>
//                       <Badge className={statusColors[order.status] || ""}>
//                         {order.status}
//                       </Badge>
//                     </TableCell>
//                     <TableCell>
//                       {order.total.toLocaleString("es-CO", {
//                         style: "currency",
//                         currency: "COP",
//                         minimumFractionDigits: 0,
//                       })}
//                     </TableCell>
//                     <TableCell>
//                       <button
//                         className="text-primary hover:underline"
//                         onClick={() => setSelectedOrder(order)}
//                       >
//                         Ver detalles
//                       </button>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </div>
//         {selectedOrder && (
//           <OrderDetail
//             order={selectedOrder}
//             onClose={() => setSelectedOrder(null)}
//           />
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default OrdersList;