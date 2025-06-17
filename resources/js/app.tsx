import '../css/app.css';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import { ReactNode } from 'react';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

createInertiaApp({
    title: (title) => `${appName} | ${title}`,
    resolve: async (name) => {
        const page = await resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')) as { default: { layout?: (page: ReactNode) => ReactNode } };
        page.default.layout = page.default.layout || ((page: ReactNode) => {
            return name === 'auth/login' ? (
                <AuthLayout title="Iniciar Sesión">{page}</AuthLayout>
            ) : (
                <AppLayout>{page}</AppLayout>
            );
        });
        return page;
    },
    setup({ el, App, props }) {
        createRoot(el).render(<QueryClientProvider client={queryClient}>
            <App {...props} />
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>);
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
