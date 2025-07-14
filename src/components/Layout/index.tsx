/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import { useSession, signIn } from 'next-auth/react';
import NavBar from '../client/NavBar';

interface LayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const Layout = ({ children, requireAuth = true }: LayoutProps) => {
  if (!requireAuth) {
    // No usamos SessionProvider, así que no usamos useSession
    return (
      <div>
        <NavBar />
        <main>{children}</main>
      </div>
    );
  }

  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    signIn('auth0');
    return <div>Redirecting...</div>;
  }

  return (
    <div>
      <NavBar />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
