import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Without this line, the app will not work in the browser when using docker-compose
  server: {
    host: true
  }
})
