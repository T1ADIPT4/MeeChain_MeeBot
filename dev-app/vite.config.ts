import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
    root: __dirname,
    plugins: [react()],
    resolve: {
        alias: {
            '@pages': path.resolve(__dirname, '../pages'),
            '@components': path.resolve(__dirname, '../components'),
            '@hooks': path.resolve(__dirname, '../hooks'),
            '@utils': path.resolve(__dirname, '../utils'),
            buffer: path.resolve(__dirname, '../node_modules/buffer'),
            process: path.resolve(__dirname, '../node_modules/process/browser.js'),
        },
    },
    define: {
        'process.env': {},
    },
    optimizeDeps: {
        include: ['buffer', 'process'],
    },
    server: {
        port: 5173,
        open: true,
    },
    preview: {
        port: 4173,
        open: true,
    },
    build: {
        outDir: path.resolve(__dirname, '../dist-preview'),
        emptyOutDir: true,
    },
});
