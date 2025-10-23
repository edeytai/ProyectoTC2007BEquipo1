import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    https: {
      key: fs.readFileSync('../backend/backend.key'),
      cert: fs.readFileSync('../backend/backend.crt'),
    },
    host: '0.0.0.0'
  },
})
