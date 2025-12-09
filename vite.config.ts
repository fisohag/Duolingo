import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
        // 🔑 THIS IS THE FIX: Forces relative paths for assets to resolve 404 errors on Vercel.
        base: './', 
        
        server: {
            port: 3000,
            host: '0.0.0.0',
        },
        plugins: [react()],
        define: {
            // Note: For Vite, variables exposed to the browser MUST start with VITE_
            // If GEMINI_API_KEY is not prefixed with VITE_ in your .env file, 
            // the 'define' section below might not be necessary if you are using 
            // import.meta.env.VITE_... in your code.
            'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
            'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, '.'),
            }
        }
    };
});
