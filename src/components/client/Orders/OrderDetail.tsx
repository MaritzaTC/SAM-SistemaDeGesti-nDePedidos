// import React from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Badge } from "@/components/ui/badge";

// type Order = {
//   id: string;
//   status: string;
//   createdAt: string;
//   total: number;
//   tax: number;
//   subtotal: number;
//   items: {
//     id: string;
//     product: { name: string; image: string };
//     quantity: number;
//     price: number;
//   }[];
// };

// const statusLabels: Record<string, string> = {
//   PENDING: "Pendiente",
//   COMPLETED: "Completado",
//   CANCELED: "Cancelado",
// };

// const OrderDetail: React.FC<{ order: Order; onClose: () => void }> = ({
//   order,
//   onClose,
// }) => {
//   return (
//     <Dialog open={!!order} onOpenChange={onClose}>
//       <DialogContent className="max-w-2xl">
//         <DialogHeader>
//           <DialogTitle>Detalle del Pedido #{order.id}</DialogTitle>
//         </DialogHeader>
//         <div className="mb-4">
//           <span className="font-semibold">Estado: </span>
//           <Badge>{statusLabels[order.status] || order.status}</Badge>
//         </div>
//         <div className="mb-4">
//           <span className="font-semibold">Fecha: </span>
//           {new Date(order.createdAt).toLocaleString()}
//         </div>
//         <div className="mb-4">
//           <span className="font-semibold">Total: </span>
//           {order.total.toLocaleString("es-CO", {
//             style: "currency",
//             currency: "COP",
//             minimumFractionDigits: 0,
//           })}
//         </div>
//         <div>
//           <span className="font-semibold">Productos:</span>
//           <ul className="mt-2 space-y-2">
//             {order.items.map((item) => (
//               <li
//                 key={item.id}
//                 className="flex items-center gap-4 border-b pb-2"
//               >
//                 <img
//                   src={item.product.image}
//                   alt={item.product.name}
//                   className="w-12 h-12 object-cover rounded"
//                 />
//                 <div>
//                   <div className="font-medium">{item.product.name}</div>
//                   <div className="text-sm text-muted-foreground">
//                     Cantidad: {item.quantity} • Precio:{" "}
//                     {item.price.toLocaleString("es-CO", {
//                       style: "currency",
//                       currency: "COP",
//                       minimumFractionDigits: 0,
//                     })}
//                   </div>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default OrderDetail;