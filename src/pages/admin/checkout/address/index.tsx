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
    <div className="max-w-xl mx-auto mt-12 p-8 bg-white shadow-lg rounded-2xl">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Datos de Envío</h2>
      <form onSubmit={handleStripeCheckout} className="space-y-5">
        <div className="grid grid-cols-1 gap-4">
          <input
            name="nombre"
            placeholder="Nombre completo"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
          <input
            name="telefono"
            placeholder="Teléfono"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.telefono}
            onChange={handleChange}
            required
          />
          <input
            name="department"
            placeholder="Departamento"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.department}
            onChange={handleChange}
            required
          />
          <input
            name="municipality"
            placeholder="Municipio"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.municipality}
            onChange={handleChange}
            required
          />
          <input
            name="neighborhood"
            placeholder="Barrio"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.neighborhood}
            onChange={handleChange}
            required
          />
          <input
            name="address"
            placeholder="Dirección"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.address}
            onChange={handleChange}
            required
          />
          <input
            name="info"
            placeholder="Información adicional"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.info}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-300"
        >
          Proceder al pago
        </button>
      </form>
    </div>
  );
}
