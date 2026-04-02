import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',   // expose to network
    port: 5173        // default vite port
  }
})





// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'

// export default defineConfig({
//   base: '/suyashtest-front/',   // 👈 IMPORTANT
//   plugins: [react(), tailwindcss()],
//   server: {
//     host: '0.0.0.0',
//     port: 5173
//   }
// })
