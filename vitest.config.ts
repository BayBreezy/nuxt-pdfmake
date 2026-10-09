import { defineConfig } from "vitest/config";

export default defineConfig({
  define: {
    // Nuxt replaces this at build time; Vitest needs it too so unit tests run in "client" mode.
    "import.meta.client": "true",
  },
  test: {
    include: ["test/**/*.test.ts"],
  },
});
