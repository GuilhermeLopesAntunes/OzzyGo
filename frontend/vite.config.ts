import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { lottie } from 'vite-plugin-lottie'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    lottie(),
    tailwindcss(),
    react()
  ],
  server: {
    host: true,
    port: 5173
  }
})
