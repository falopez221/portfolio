import { defineConfig } from "vite";

export default defineConfig({
  build: {
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
