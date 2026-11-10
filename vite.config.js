import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

// Serves /api/* from the same Vercel function files during `npm run dev`.
function apiDev() {
  return {
    name: "lumen-api-dev",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url, "http://localhost");
        if (!url.pathname.startsWith("/api/")) return next();
        const parts = url.pathname.slice(5).split("/").filter(Boolean);
        let file = resolve("api", ...parts) + ".js";
        const query = Object.fromEntries(url.searchParams);
        if (!existsSync(file) && parts.length > 1) {
          file = resolve("api", ...parts.slice(0, -1), "[id].js");
          query.id = parts.at(-1);
        }
        if (parts[0]?.startsWith("_") || !existsSync(file)) return next();
        try {
          const mod = await server.ssrLoadModule(file);
          req.query = query;
          await mod.default(req, res);
        } catch (err) {
          server.config.logger.error(String(err?.stack || err));
          if (!res.headersSent) { res.statusCode = 500; res.end('{"error":"server_error"}'); }
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  // Server-side secrets (MONGODB_URI, ADMIN_TOKEN) from .env.local, for the dev API only.
  Object.assign(process.env, loadEnv(mode, process.cwd(), ""));
  return {
    plugins: [react(), apiDev()],
    server: { port: 5173, open: false },
    build: {
      // three.js ships in its own lazily loaded chunk after first paint; its size is expected.
      chunkSizeWarningLimit: 1000,
      rollupOptions: { input: { main: resolve("index.html"), admin: resolve("admin.html") } },
    },
  };
});
