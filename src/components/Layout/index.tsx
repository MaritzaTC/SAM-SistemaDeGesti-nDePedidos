/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
// import { AppSidebar } from '@/components/Dashboard/app-sidebar';
// import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useSession, signIn } from 'next-auth/react';

interface LayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const Index = ({ children, requireAuth = true }: LayoutProps) => {
  const { data: session, status } = useSession();

  if (requireAuth && status === 'loading') {
    return <div>Loading...</div>;
  }

if (requireAuth && status === 'unauthenticated') {
  signIn('auth0');
  return <div>Redirecting...</div>;
}

  return (
    // <SidebarProvider
    //   style={
    //     {
    //       '--sidebar-width': 'calc(var(--spacing) * 72)',
    //       '--header-height': 'calc(var(--spacing) * 12)',
    //     } as React.CSSProperties
    //   }
    // >
    //   <AppSidebar variant="inset" />
    //   <SidebarInset>
    //     <main>{children}</main>
    //   </SidebarInset>
    // </SidebarProvider>
    <div>
      
    </div>
  );
};

export default Index;
