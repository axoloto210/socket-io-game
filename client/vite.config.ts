import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import Sitemap from "vite-plugin-sitemap";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // https://vite.dev/config/#using-environment-variables-in-config
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      react(),
      Sitemap({
        hostname: env.VITE_FRONTEND_URL,
      }),
    ],
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
  };
});
