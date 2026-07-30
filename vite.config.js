import { defineConfig } from "vite";
import { mkdirSync, copyFileSync } from "node:fs";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [
    {
      name: "sites-static-worker",
      closeBundle() {
        const serverDirectory = resolve("dist/server");
        mkdirSync(serverDirectory, { recursive: true });
        copyFileSync(resolve("worker/index.js"), resolve(serverDirectory, "index.js"));
      },
    },
  ],
  build: {
    outDir: "dist/client",
    rollupOptions: {
      onwarn(warning, warn) {
        if (
          warning.code === "MODULE_LEVEL_DIRECTIVE" &&
          warning.message.includes("use client") &&
          warning.id?.includes("node_modules/framer-motion")
        ) {
          return;
        }

        warn(warning);
      },
    },
  },
});
