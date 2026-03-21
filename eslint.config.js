//  @ts-check

import { tanstackConfig } from "@tanstack/eslint-config"
import reactRefresh from "eslint-plugin-react-refresh"

export default [
  ...tanstackConfig,
  {
    rules: {
      "@typescript-eslint/no-unnecessary-condition": "off",
      "no-shadow": "off",
      "@typescript-eslint/no-shadow": "off",
      "import/order": "off",
      "sort-imports": "off",
    },
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: {
      "react-refresh": reactRefresh,
    },
    rules: {
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      // Strict rules for source code
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports" },
      ],
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
  {
    ignores: [
      "dist/**",
      ".vinxi/**",
      ".output/**",
      "src/routeTree.gen.ts",
      "node_modules/**",
      "eslint.config.js",
      "prettier.config.js",
    ],
  },
]
