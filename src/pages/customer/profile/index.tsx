import React from "react";
import { useSession } from "next-auth/react";

const MiPerfil = () => {
  const { data: session } = useSession();

  if (!session) return <p className="text-center text-gray-500 mt-10">Cargando sesión...</p>;

  const {
    name,
    email,
    role,
    phone,
    documentNumber,
    lastName,
  } = session.user;

  return (
    <div className="min-h-screen bg-white">
      {/* Header con degradado */}
      <div className="w-full bg-gradient-to-r from-blue-200 to-blue-400 py-6 px-6 shadow">
        <h1 className="text-3xl md:text-4xl font-bold text-white">PERFIL</h1>
      </div>

      {/* Contenedor de información */}
      <div className="max-w-4xl mx-auto mt-8 bg-white shadow-md rounded-xl p-6 border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10 text-gray-800 text-sm md:text-base">
          <div>
            <p className="font-semibold">Nombre</p>
            <p>{name || "—"}</p>
          </div>

          <div>
            <p className="font-semibold">Apellido</p>
            <p>{lastName || "—"}</p>
          </div>

          <div>
            <p className="font-semibold">Email</p>
            <p>{email}</p>
          </div>

          <div>
            <p className="font-semibold">Rol</p>
            <p>{role}</p>
          </div>

          <div>
            <p className="font-semibold">Cédula de ciudadanía</p>
            <p>{documentNumber || "—"}</p>
          </div>

          <div>
            <p className="font-semibold">Teléfono</p>
            <p>{phone || "—"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiPerfil;
