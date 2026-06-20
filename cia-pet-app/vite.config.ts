import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,   // expõe na rede local (acesso via IP do PC pelo celular)
    port: 5173,
  },
})
