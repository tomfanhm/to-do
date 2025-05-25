//  @ts-check

import { tanstackConfig } from "@tanstack/eslint-config"

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
]
