import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import Layout from '@/components/Layout';

type CustomAppProps = AppProps & {
  Component: AppProps['Component'] & {
    noAuth?: boolean;
    noLayout?: boolean;
  };
};

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: CustomAppProps) {
  const isPublic = Component.noAuth ?? false;
  const useLayout = !Component.noLayout;

  const content = useLayout ? (
    <Layout requireAuth={!isPublic}>
      <Component {...pageProps} />
    </Layout>
  ) : (
    <Component {...pageProps} />
  );

  return isPublic ? content : (
    <SessionProvider session={session}>
      {content}
    </SessionProvider>
  );
}
