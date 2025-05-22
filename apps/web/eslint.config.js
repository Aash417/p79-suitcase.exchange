import { nextJsConfig } from "@repo/eslint-config/next-js";

/** @type {import("eslint").Linter.Config} */

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
   baseDirectory: __dirname,
});

const eslintConfig = [
   ...compat.extends('next/core-web-vitals', 'next/typescript'),
   {
      rules: {
         '@typescript-eslint/no-explicit-any': 'off',
      },
   },
];

export default nextJsConfig;
