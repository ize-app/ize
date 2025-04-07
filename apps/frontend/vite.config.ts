import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { sentryVitePlugin } from "@sentry/vite-plugin";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      react(),
      tsconfigPaths(),
      // sentry plugin needs to be listed last
      sentryVitePlugin({
        authToken: process.env.SENTRY_AUTH_TOKEN,
        org: "ize",
        project: "ize-frontend",
      }),
    ],
    build: {
      outDir: "../backend/dist/frontend",
      sourcemap: true,
    },
    server: {
      host: "127.0.0.1",
      port: 3001,
      proxy: {
        "/api": {
          target: env.VITE_LOCAL_BACKEND_URL,
          changeOrigin: true,
          // rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  };
});
