import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "localhost",
    port: 8082,
    strictPort: false,
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
  },
  build: {
    target: 'esnext',
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': [
            '@radix-ui/react-navigation-menu',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-dialog',
            '@radix-ui/react-slot',
            '@radix-ui/react-checkbox',
          ],
          'form-vendor': ['react-hook-form', '@hookform/resolvers/zod', 'zod'],
          'utils-vendor': ['sonner', 'lucide-react', 'class-variance-authority'],
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  define: {
    'process.env': '{}',
  },
}));
