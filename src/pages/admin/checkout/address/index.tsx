import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";

export default function CheckoutAddress() {
  const { data: session } = useSession();
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const savedTotal = sessionStorage.getItem("checkoutTotal");
    if (savedTotal) {
      setTotal(Number(savedTotal));
    }
  }, []);

  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    department: "",
    municipality: "",
    neighborhood: "",
    address: "",
    info: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleStripeCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      return signIn("auth0", { callbackUrl: window.location.href });
    }

    try {
      sessionStorage.setItem("shippingData", JSON.stringify(formData));

      const response = await fetch("/api/payment/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          currency: "cop",
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Error al iniciar el pago");
      }
    } catch (error) {
      console.error("Stripe checkout error:", error);
      alert("Hubo un problema al conectar con Stripe");
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 py-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Formulario */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-bold text-blue-900 mb-2">INFORMACIÓN DE ENVÍO</h2>
          <p className="text-sm text-gray-500 mb-6">
            Solicitamos únicamente la información esencial para la finalización de la compra
          </p>

          <form onSubmit={handleStripeCheckout} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                name="nombre"
                placeholder="Nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="border-b border-blue-900 p-2 outline-none"
              />
              <input
                name="telefono"
                placeholder="Teléfono / Móvil"
                value={formData.telefono}
                onChange={handleChange}
                required
                className="border-b border-blue-900 p-2 outline-none"
              />
              <input
                name="department"
                placeholder="Departamento"
                value={formData.department}
                onChange={handleChange}
                required
                className="border-b border-blue-900 p-2 outline-none"
              />
              <input
                name="municipality"
                placeholder="Municipio"
                value={formData.municipality}
                onChange={handleChange}
                required
                className="border-b border-blue-900 p-2 outline-none"
              />
              <input
                name="neighborhood"
                placeholder="Barrio"
                value={formData.neighborhood}
                onChange={handleChange}
                required
                className="border-b border-blue-900 p-2 outline-none"
              />
              <input
                name="address"
                placeholder="Dirección"
                value={formData.address}
                onChange={handleChange}
                required
                className="border-b border-blue-900 p-2 outline-none"
              />
            </div>
            <input
              name="info"
              placeholder="Información adicional (opcional)"
              value={formData.info}
              onChange={handleChange}
              className="border-b border-blue-900 p-2 outline-none w-full"
            />

            <button
              type="submit"
              className="bg-blue-800 hover:bg-blue-900 text-white font-bold py-3 px-6 rounded-lg transition-all"
            >
              Siguiente
            </button>
          </form>
        </div>

        {/* Resumen de la compra */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-bold text-blue-800 mb-4 text-center">RESUMEN DE LA COMPRA</h3>
          <div className="flex items-center mb-4">
            <div>
              <p className="font-semibold text-sm">.......</p>
              <p className="text-sm">Cantidad: <strong>1</strong></p>
              <p className="text-sm text-blue-600">$ 369.600</p>
              <p className="text-xs text-gray-500">Hasta 8 días hábiles</p>
            </div>
          </div>

          <div className="border-t pt-4 text-sm">
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>${total.toLocaleString("es-CO")}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span>Gastos del envío</span>
              <span className="text-green-600 font-semibold">Gratis</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-blue-900 border-t pt-3">
              <span>Total</span>
              <span>${total.toLocaleString("es-CO")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
