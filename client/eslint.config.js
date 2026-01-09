import js from "@eslint/js";
import { globalIgnores } from "eslint/config";
import importPlugin from "eslint-plugin-import";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";
import prettierPlugin from "eslint-plugin-prettier";
import globals from "globals";
import { defineConfig, configs as tsConfigs } from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";

export default defineConfig([
    globalIgnores(["dist"]),
    {
        files: ["**/*.{js,ts,tsx}"],
        extends: [
            js.configs.recommended,
            ...tsConfigs.recommended,
            reactHooks.configs.flat["recommended-latest"],
            reactRefresh.configs.vite,
            prettierConfig,
        ],
        plugins: {
            import: importPlugin,
            "simple-import-sort": simpleImportSort,
            "unused-imports": unusedImports,
            prettier: prettierPlugin,
        },
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        rules: {
            "prettier/prettier": "error",

            "no-var": "error",
            "prefer-const": "error",
            "no-console": "warn",
            "no-debugger": "error",

            "import/first": "error",
            "import/newline-after-import": "error",
            "import/no-duplicates": "error",
            "import/no-unresolved": "off",

            "simple-import-sort/imports": "error",
            "simple-import-sort/exports": "error",

            "unused-imports/no-unused-imports": "error",
            "unused-imports/no-unused-vars": "error",
        },
    },
]);
