// pages/admin/dashboard.tsx

import { DashboardLayout } from "@/components/admin/DashboardLayout";
import { useState } from "react";

const mockProductos = [
  { id: "1", nombre: "Camiseta Blanca" },
  { id: "2", nombre: "Pantalón Azul" },
];

type Movimiento = {
  id: string;
  fecha: string;
  cantidad: number;
  tipo: "Entrada" | "Salida";
  responsable: string;
};

const DashboardPage = () => {
  const [productoSeleccionado, setProductoSeleccionado] = useState<string>("1");
  const [movimientosData, setMovimientosData] = useState<Record<string, Movimiento[]>>({
    "1": [
      { id: "m1", fecha: "2025-07-15", cantidad: 10, tipo: "Entrada", responsable: "Admin" },
      { id: "m2", fecha: "2025-07-16", cantidad: -5, tipo: "Salida", responsable: "Empleado1" },
    ],
    "2": [
      { id: "m3", fecha: "2025-07-15", cantidad: 20, tipo: "Entrada", responsable: "Admin" },
    ],
  });

  const movimientos = movimientosData[productoSeleccionado] || [];

  const [mostrarDialogo, setMostrarDialogo] = useState(false);
  const [tipoMovimiento, setTipoMovimiento] = useState<"Entrada" | "Salida">("Entrada");
  const [cantidad, setCantidad] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);

  const crearMovimiento = () => {
    setLoading(true);
    setTimeout(() => {
      const nuevoMovimiento: Movimiento = {
        id: "m" + Math.random().toString(36).substr(2, 5),
        fecha: new Date().toISOString().slice(0, 10),
        cantidad: tipoMovimiento === "Entrada" ? cantidad : -cantidad,
        tipo: tipoMovimiento,
        responsable: "Admin", // simulado
      };

      setMovimientosData((prev) => ({
        ...prev,
        [productoSeleccionado]: [...(prev[productoSeleccionado] || []), nuevoMovimiento],
      }));

      setLoading(false);
      setMensaje("Movimiento creado exitosamente.");
      setMostrarDialogo(false);
      setCantidad(0);
      setTipoMovimiento("Entrada");

      setTimeout(() => setMensaje(null), 3000);
    }, 1000);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Gestión de Transacciones</h1>

      <div className="mb-6">
        <label className="block mb-2 font-medium">Selecciona un producto:</label>
        <select
          className="p-2 border rounded w-full"
          value={productoSeleccionado}
          onChange={(e) => setProductoSeleccionado(e.target.value)}
        >
          {mockProductos.map((producto) => (
            <option key={producto.id} value={producto.id}>
              {producto.nombre}
            </option>
          ))}
        </select>
      </div>

      <button
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
        onClick={() => setMostrarDialogo(true)}
      >
        Agregar movimiento
      </button>

      <table className="w-full border rounded overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-2">ID del movimiento</th>
            <th className="text-left p-2">Fecha</th>
            <th className="text-left p-2">Cantidad</th>
            <th className="text-left p-2">Responsable</th>
          </tr>
        </thead>
        <tbody>
          {movimientos.map((movimiento) => (
            <tr key={movimiento.id} className="border-t">
              <td className="p-2">{movimiento.id}</td>
              <td className="p-2">{movimiento.fecha}</td>
              <td className={`p-2 ${movimiento.cantidad > 0 ? "text-green-600" : "text-red-600"}`}>
                {movimiento.cantidad}
              </td>
              <td className="p-2">{movimiento.responsable}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Diálogo de agregar movimiento */}
      {mostrarDialogo && (
        <div className="fixed inset-0 bg-opacity-10 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Agregar movimiento</h2>

            <p className="mb-2 font-medium">Producto: {
              mockProductos.find(p => p.id === productoSeleccionado)?.nombre
            }</p>

            <div className="mb-4">
              <label className="block mb-1">Tipo de movimiento:</label>
              <select
                className="p-2 border rounded w-full"
                value={tipoMovimiento}
                onChange={(e) => setTipoMovimiento(e.target.value as "Entrada" | "Salida")}
              >
                <option value="Entrada">Entrada</option>
                <option value="Salida">Salida</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block mb-1">Cantidad:</label>
              <input
                type="number"
                className="p-2 border rounded w-full"
                value={cantidad}
                onChange={(e) => setCantidad(Number(e.target.value))}
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded"
                onClick={() => setMostrarDialogo(false)}
              >
                Cancelar
              </button>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                onClick={crearMovimiento}
                disabled={loading || cantidad <= 0}
              >
                {loading ? "Guardando..." : "Crear movimiento"}
              </button>
            </div>

            {mensaje && <p className="mt-4 text-green-600">{mensaje}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

DashboardPage.getLayout = (page: React.ReactNode) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default DashboardPage;
