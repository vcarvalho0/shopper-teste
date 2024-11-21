import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-plugin-prettier";
import configPrettier from "eslint-config-prettier";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    plugins: {
      prettier: prettier
    },
    rules: {
      ...configPrettier.rules,
      "prettier/prettier": "error"
    }
  },

  pluginJs.configs.recommended,
  ...tseslint.configs.recommended
];
