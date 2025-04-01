import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
<<<<<<< HEAD
  base: './',
=======
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
<<<<<<< HEAD
  preview: {
    port: 4173,
  },
=======
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
}));
