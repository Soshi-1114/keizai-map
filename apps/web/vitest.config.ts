import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
  test: {
    environment: "node",
    include: [
      "lib/**/*.test.ts",
      "lib/**/__tests__/**/*.test.ts",
      "../../packages/**/*.test.ts",
      "../../packages/**/__tests__/**/*.test.ts",
    ],
    exclude: ["e2e/**", "node_modules/**", ".next/**", "../../**/node_modules/**"],
    coverage: {
      include: ["lib/**/*.ts", "../../packages/**/src/**/*.ts"],
      exclude: ["lib/**/*.test.ts", "lib/data.generated.json", "../../packages/**/*.test.ts"],
    },
  },
});
