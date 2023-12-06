import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],

  resolve: {
    alias: {
      'socket.io-client': 'socket.io-client/dist/socket.io.js',
    },
  },
  define: {
    global: 'window',
  },
  // Without this line, the app will not work in the browser when using docker-compose
  server: {
    host: true,

    port: 5173, // specify the port you want to use
  },
})
