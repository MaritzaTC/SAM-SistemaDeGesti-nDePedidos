import React from 'react';
import { useSession, signIn } from 'next-auth/react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/Dashboard/app-sidebar';

import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/router';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

type UserWithRole = {
  address: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const user = session?.user as UserWithRole | undefined;

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Cargando...</span>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    signIn(); // redirige a login
    return null;
  }

  if (!user || (user.role !== 'ADMIN' && user.role !== 'EMPLEADO')) {
    router.push('/');
    return null;
  }

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
     <AppSidebar
  user={{
    ...user,
    name: user?.name ?? '',
    email: user?.email ?? '',
    image: user?.image ?? undefined, 
  }}
/>


      <SidebarInset>
        <header className="h-16 border-b bg-card flex items-center px-6 gap-4">
          <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-foreground">
              Panel de {user.role === 'ADMIN' ? 'Administración' : 'Empleado'}
            </h1>
          </div>
        </header>

        <main className="p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
