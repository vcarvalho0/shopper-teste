import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { config } from 'dotenv'

config()

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    plugins: [react()],
    server: {
      host: true,
      strictPort: true,
      port: 80
    },
    define: {
      VITE_GOOGLE_API_KEY: JSON.stringify(env.GOOGLE_API_KEY)
    }
  }
})