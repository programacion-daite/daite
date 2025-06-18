import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig((configEnv) => {
    const isSsrBuild = configEnv.isSsrBuild;
    return {
        plugins: [
            laravel({
                input: ['resources/css/app.css', 'resources/js/app.tsx'],
                ssr: 'resources/js/ssr.tsx',
                refresh: true,
            }),
            react({
                jsxRuntime: 'automatic',
                babel: {
                    plugins: [
                        ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }]
                    ]
                }
            }),
            tailwindcss(),
        ],
        esbuild: {
            jsx: 'automatic',
        },
        resolve: {
            alias: {
                '@': resolve(__dirname, './resources/js'),
                'ziggy-js': resolve(__dirname, 'vendor/tightenco/ziggy'),
            },
        },
        build: {
            rollupOptions: {
                output: !isSsrBuild ? {
                    manualChunks: {
                        lucide: ['lucide-react'],
                        reactVendor: ['react', 'react-dom'],
                        aggrid: ['ag-grid-community', 'ag-grid-react'],
                    },
                } : undefined,
            },
        },
        optimizeDeps: {
            include: ['react', 'react-dom'],
        },

    };
});
