import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
 optimizeDeps: {
    // These are the common culprits for 504 errors in Recharts
    include: [
      'recharts', 
      'recharts/lib/chart/AreaChart', 
      'recharts/lib/chart/RadialBarChart',
      'lucide-react'
    ],
  },
  
})