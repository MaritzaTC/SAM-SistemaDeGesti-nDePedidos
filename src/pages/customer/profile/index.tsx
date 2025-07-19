/* eslint-disable @typescript-eslint/no-unused-vars */
// pages/mi-perfil.tsx
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { UserForm } from '@/components/admin/UserForm'; // Asegúrate que este es el path correcto
import { Skeleton } from '@/components/ui/skeleton';

const MiPerfil = () => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

<<<<<<< HEAD
  if (!session)
    return (
      <p className="text-center text-gray-500 mt-10">Cargando sesión...</p>
    );

  const { name, email, phone, documentNumber, lastName } = session.user;
=======
  const fetchUserProfile = async () => {
    try {
      const res = await fetch('/api/profile');
      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error('Error cargando perfil:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchUserProfile();
    }
  }, [status]);

  if (status === 'loading' || loading) {
    return <Skeleton className="h-60 w-full" />;
  }

  if (!user) return <p className="text-center text-red-500">No se pudo cargar el perfil</p>;
>>>>>>> 6ecd687a1d8cb00561dc89cf23e77c9bdca8570a

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 border rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Mi Perfil</h2>
      <h4 className="text-lg text-gray-600 mb-6 text-center">Actualiza tu información personal</h4>
      <UserForm user={user} onClose={() => {}} onUpdate={fetchUserProfile} isOwnProfile={true} />
    </div>
  );
};

export default MiPerfil;
