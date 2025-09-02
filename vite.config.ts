import { defineConfig } from "vite"
import path from "path"

export default defineConfig({
  resolve: {
    alias: {
      "@client": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "client", "assets"),
      "@server": path.resolve(__dirname, "server"),
    },
  },
  root: path.resolve(__dirname, "client"),
  publicDir: path.resolve(__dirname, "client", "public"),
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      allow: ["."],
    },
  },
})