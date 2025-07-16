/* eslint-disable @typescript-eslint/no-explicit-any */
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import Layout from '@/components/Layout';
import { ReactElement, ReactNode } from 'react';
import { NextPage } from 'next';

// Tipo para permitir `getLayout`
type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

// Nuevo _app
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) {
  // Usa el layout definido por la página o aplica el layout por defecto
  const getLayout =
    Component.getLayout ??
    ((page) => <Layout requireAuth={!(Component as any).noAuth}>{page}</Layout>);

  return (
    <SessionProvider session={session}>
      {getLayout(<Component {...pageProps} />)}
    </SessionProvider>
  );
}
