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
    return  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700">
  <div className="text-white text-2xl font-semibold flex items-center gap-2">
    <span className="flex gap-1 ml-2">
      <span className="w-6 h-6 bg-white rounded-full animate-bounce [animation-delay:0s]" />
      <span className="w-6 h-6 bg-white rounded-full animate-bounce [animation-delay:0.2s]" />
      <span className="w-6 h-6 bg-white rounded-full animate-bounce [animation-delay:0.4s]" />
    </span>
  </div>
</div>
;
  }

  return (
    <div>
      <NavBar />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
