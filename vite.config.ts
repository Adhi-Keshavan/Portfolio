import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return undefined;
          }

          if (id.includes('@react-three/drei')) {
            return 'drei-vendor';
          }

          if (id.includes('@react-three/fiber')) {
            return 'r3f-vendor';
          }

          if (id.includes('three/examples')) {
            return 'three-examples-vendor';
          }

          if (/node_modules[\\/]three[\\/]/.test(id)) {
            return 'three-core-vendor';
          }

          if (/node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) {
            return 'react-vendor';
          }

          if (id.includes('framer-motion') || id.includes('motion-dom')) {
            return 'motion-vendor';
          }

          return 'vendor';
        },
      },
    },
  },
})
