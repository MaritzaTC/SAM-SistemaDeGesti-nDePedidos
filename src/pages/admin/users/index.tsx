/* eslint-disable @typescript-eslint/no-explicit-any */
import { DashboardLayout } from "@/components/admin/DashboardLayout";
import { ReactElement, JSXElementConstructor, ReactNode, useState } from "react";

const Index = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'EMPLEADO',
  });

  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok) {
      setStatus('success');
      setMessage('✅ Usuario creado correctamente');
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'EMPLEADO',
      });
    } else {
      setStatus('error');
      setMessage(`❌ Error: ${data.message || 'No se pudo crear el usuario'}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-md mx-auto p-6 mt-10 border rounded-md shadow-lg bg-white"
    >
      <h2 className="text-2xl font-bold text-center">Crear nuevo usuario</h2>

      <input
        type="text"
        placeholder="Nombre"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="w-full px-3 py-2 border rounded"
        required
      />

      <input
        type="email"
        placeholder="Correo electrónico"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        className="w-full px-3 py-2 border rounded"
        required
      />

      <input
        type="password"
        placeholder="Contraseña"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        className="w-full px-3 py-2 border rounded"
        required
      />

      <select
        value={formData.role}
        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
        className="w-full px-3 py-2 border rounded"
      >
        <option value="EMPLEADO">Empleado</option>
        <option value="ADMIN">Administrador</option>
      </select>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        disabled={status === 'loading'}
      >
        {status === 'loading' ? 'Creando...' : 'Crear Usuario'}
      </button>

      {message && (
        <p className={`text-center text-sm ${status === 'error' ? 'text-red-600' : 'text-green-600'}`}>
          {message}
        </p>
      )}
    </form>
  );
};

Index.getLayout = (
  page: ReactElement<any, string | JSXElementConstructor<any>>
): ReactNode => <DashboardLayout>{page}</DashboardLayout>;

export default Index;
