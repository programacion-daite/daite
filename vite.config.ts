import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig((configEnv) => {
    const isSsrBuild = configEnv.isSsrBuild;
    return {
        build: {
            rollupOptions: {
                output: !isSsrBuild ? {
                    manualChunks: {
                        aggrid: ['ag-grid-community', 'ag-grid-react'],
                        lucide: ['lucide-react'],
                        reactVendor: ['react', 'react-dom'],
                    },
                } : undefined,
            },
        },
        esbuild: {
            jsx: 'automatic',
        },
        optimizeDeps: {
            include: ['react', 'react-dom'],
        },
        plugins: [
            laravel({
                input: ['resources/css/app.css', 'resources/js/app.tsx'],
                refresh: true,
                ssr: 'resources/js/ssr.tsx',
            }),
            react({
                babel: {
                    plugins: [
                        ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }]
                    ]
                },
                jsxRuntime: 'automatic'
            }),
            tailwindcss(),
        ],
        resolve: {
            alias: {
                '@': resolve(__dirname, './resources/js'),
                'ziggy-js': resolve(__dirname, 'vendor/tightenco/ziggy'),
            },
        },

    };
});
