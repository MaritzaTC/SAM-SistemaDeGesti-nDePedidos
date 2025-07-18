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
   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    department: "",
    municipality: "",
    neighborhood: "",
    address: "",
    info: "",
  });

const handleStripeCheckout = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!session) {
    return signIn("auth0", { callbackUrl: window.location.href });
  }

  try {
    // 1. Guardar dirección antes de redirigir
    const addressRes = await fetch("/api/address", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        department: formData.department,
        municipality: formData.municipality,
        neighborhood: formData.neighborhood,
        address: formData.address,
        info: formData.info,
      }),
    });

    const addressData = await addressRes.json();

    if (!addressRes.ok) {
      throw new Error(addressData.message || "No se pudo guardar la dirección");
    }

    // 2. Guardar datos temporales en sessionStorage
    sessionStorage.setItem("shippingData", JSON.stringify(formData));

    // 3. Iniciar pago
    const paymentRes = await fetch("/api/payment/payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: total,
        currency: "cop",
      }),
    });

    const data = await paymentRes.json();

    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Error al iniciar el pago");
    }
  } catch (error) {
    console.error("Checkout error:", error);
    alert("Hubo un problema al procesar tu pedido");
  }
};


  return (
   <div className="min-h-screen bg-white px-6 py-10">
  <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
    {/* Formulario */}
    <div className="md:col-span-2">
      <h2 className="text-3xl font-semibold text-gray-900 mb-2">Información de envío</h2>
      <p className="text-gray-500 text-sm mb-8">
        Solo pedimos los datos necesarios para realizar tu entrega. ¡Gracias por tu compra!
      </p>

      <form onSubmit={handleStripeCheckout} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { name: "nombre", placeholder: "Nombre" },
            { name: "telefono", placeholder: "Teléfono / Móvil" },
            { name: "department", placeholder: "Departamento" },
            { name: "municipality", placeholder: "Municipio" },
            { name: "neighborhood", placeholder: "Barrio" },
            { name: "address", placeholder: "Dirección" },
          ].map((field) => (
            <input
              key={field.name}
              name={field.name}
              placeholder={field.placeholder}
              value={formData[field.name as keyof typeof formData]}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
            />
          ))}
        </div>
         
        <input
          name="info"
          placeholder="Información adicional (opcional)"
          value={formData.info}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
        />
        <button
          type="submit"
          className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-xl transition-all w-full sm:w-auto"
        >
          Continuar con el pago
        </button>
      </form>
    </div>

    {/* Resumen de la compra */}
    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-6 text-center">
        Resumen de la compra
      </h3>

      <div className="flex items-center gap-4 mb-6">
        <img
          src="/example-product.jpg"
          alt="Producto"
          className="w-20 h-20 object-cover rounded-xl border"
        />
        <div className="flex-1">
          <p className="font-medium text-sm text-gray-700">Nombre del producto</p>
          <p className="text-sm text-gray-500">Cantidad: <strong>1</strong></p>
          <p className="text-sm text-blue-700 font-semibold">$369.600</p>
          <p className="text-xs text-gray-400">Entrega: hasta 8 días hábiles</p>
        </div>
      </div>

      <div className="text-sm border-t pt-4 space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="text-gray-700 font-medium">${total.toLocaleString("es-CO")}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Envío</span>
          <span className="text-green-600 font-semibold">Gratis</span>
        </div>
        <div className="flex justify-between pt-3 border-t text-base font-semibold text-blue-800">
          <span>Total</span>
          <span>${total.toLocaleString("es-CO")}</span>
        </div>
      </div>
    </div>
  </div>
</div>

  );
}
