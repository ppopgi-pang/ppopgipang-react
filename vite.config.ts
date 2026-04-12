import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import path from 'path';
import fs from 'fs';

const isDev = process.env.NODE_ENV === 'development';

export default defineConfig({
    server: isDev
        ? {
              https: {
                  key: fs.readFileSync(path.resolve(__dirname, 'key.pem')),
                  cert: fs.readFileSync(path.resolve(__dirname, 'cert.pem')),
              },
          }
        : undefined,
    plugins: [
        tanstackRouter({
            target: 'react',
            autoCodeSplitting: true,
        }),
        react(),
        svgr({
            include: '**/*.svg?react',
            svgrOptions: {
                icon: true,
            },
        }),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
});
