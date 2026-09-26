import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["canary-tests/**/*.test.ts"],
  },
});
