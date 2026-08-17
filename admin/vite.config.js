import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
 optimizeDeps: {
    // These are the common culprits for 504 errors in Recharts
    
  },
  
})