import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import Sitemap from "vite-plugin-sitemap";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), Sitemap()],
  resolve: {
    alias: {
      "@socket-io-game/common": resolve(__dirname, "../common/dist"),
    },
  },
  optimizeDeps: {
    include: ["@socket-io-game/common"],
  },
  build: {
    commonjsOptions: {
      include: [/common/, /node_modules/],
    },
  },
});
