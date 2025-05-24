//  @ts-check

/** @type {import('prettier').Config} */
const config = {
  endOfLine: "lf",
  semi: false,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "es5",
  importOrder: [
    "^(react/(.*)$)|^(react$)",
    "<THIRD_PARTY_MODULES>",
    "",
    "^types$",
    "^@/env(.*)$",
    "^@/components/ui/(.*)$",
    "@/config/(.*)$",
    "^@/components/(.*)$",
    "^@/contexts/(.*)$",
    "^@/hooks/(.*)$",
    "^@/integrations/(.*)$",
    "^@/lib/(.*)$",
    "^@/routes/(.*)$",
    "^@/schemas/(.*)$",
    "",
    "^[./]",
  ],
  importOrderParserPlugins: ["typescript", "jsx"],
  plugins: [
    "@ianvs/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
}

export default config
