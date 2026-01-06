import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@/core': fileURLToPath(new URL('./src/core', import.meta.url)),
            '@/adapters': fileURLToPath(new URL('./src/adapters', import.meta.url)),
            '@/shared': fileURLToPath(new URL('./src/shared', import.meta.url)),
        }
    }
})
