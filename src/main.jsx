import React, { Suspense, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';

import 'assets/css/App.css';

import { hasLoggedIn } from './api/internal';
import { QueryHolder } from './contexts/components/AsyncContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { config } from './config/config';
import GuildBoard, { GuildRoutes } from 'layouts/guild';

const AuthLayout = React.lazy(() => import('layouts/auth'));
const AdminLayout = React.lazy(() => import('layouts/admin'));

function LazyFallback() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-(--accent-primary) border-t-transparent" />
        <p className="text-sm text-(--text-secondary)">Loading...</p>
      </div>
    </div>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

const TRUSTED_REDIRECT_DOMAINS = ['discord.com', 'discordapp.com'];

function Redirect({ url }) {
  useEffect(() => {
    try {
      const parsed = new URL(url);
      if (TRUSTED_REDIRECT_DOMAINS.some(d => parsed.hostname === d || parsed.hostname.endsWith('.' + d))) {
        window.location.href = url;
      } else {
        console.error('Redirect blocked: untrusted domain', parsed.hostname);
        window.location.href = '/admin';
      }
    } catch {
      console.error('Redirect blocked: invalid URL', url);
      window.location.href = '/admin';
    }
  }, [url]);
  return null;
}

function AppRouter() {
  const loginQuery = useQuery({
    queryKey: ['logged_in'],
    queryFn: () => hasLoggedIn(),
    refetchOnWindowFocus: false,
  });
  const loggedIn = loginQuery.data;

  if (loginQuery.isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-(--accent-primary) border-t-transparent" />
      </div>
    );
  }

  return (
    <QueryHolder query={loginQuery}>
      <BrowserRouter>
        <Suspense fallback={<LazyFallback />}>
          <Routes>
            {loggedIn && (
              <>
                <Route path="/admin" element={<AdminLayout />} />
                <Route path="/guild/:id" element={<GuildBoard />}>
                  {GuildRoutes()}
                </Route>
                <Route path="/invite" element={<Redirect url={config.inviteUrl} />} />
                <Route path="*" element={<Navigate replace to="/admin" />} />
              </>
            )}
            {!loggedIn && (
              <>
                <Route path="/auth" element={<AuthLayout isCallback />} />
                <Route path="/signin" element={<AuthLayout />} />
                <Route path="*" element={<Navigate replace to="/signin" />} />
              </>
            )}
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryHolder>
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ErrorBoundary>
        <Toaster position="top-right" richColors />
        <QueryClientProvider client={queryClient}>
          <SettingsProvider>
            <AppRouter />
          </SettingsProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </ThemeProvider>
  </React.StrictMode>
);
