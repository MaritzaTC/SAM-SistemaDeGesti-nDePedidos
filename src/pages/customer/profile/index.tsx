/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// pages/customer/profile.tsx
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { UserForm } from '@/components/admin/UserForm'; // Ajusta el path si es necesario
import { Skeleton } from '@/components/ui/skeleton';

const ProfilePage = () => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  if (!user) {
    return <p className="text-center text-red-500">No se pudo cargar el perfil</p>;
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 border rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Mi Perfil</h2>
      <UserForm user={user} onClose={() => {}} onUpdate={fetchUserProfile} isOwnProfile={true} />
    </div>
  );
};

export default ProfilePage;
