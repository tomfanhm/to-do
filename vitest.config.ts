import viteTsConfigPaths from "vite-tsconfig-paths"
import { defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [
    viteTsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
  ],
  test: {
    globals: true,
    environment: "jsdom",
    passWithNoTests: true,
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules", "dist", ".vinxi", "e2e"],
    setupFiles: ["./src/test/setup.ts"],
    coverage: {
      provider: "v8",
      include: ["src/features/**", "src/services/**"],
      exclude: ["src/**/*.test.*", "src/test/**"],
    },
  },
})
