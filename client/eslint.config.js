import js from "@eslint/js";
import { globalIgnores } from "eslint/config";
import prettierConfig from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
    globalIgnores(["dist", "coverage", "src/components/ui/**/*"]),

    js.configs.recommended,

    ...tseslint.configs.recommended,

    {
        files: ["**/*.{js,jsx,ts,tsx}"],

        plugins: {
            import: importPlugin,
            "simple-import-sort": simpleImportSort,
            "unused-imports": unusedImports,
        },

        languageOptions: {
            ecmaVersion: 2020,
            sourceType: "module",
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.es2021,
                ...globals.vitest,
            },
        },

        rules: {
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

    reactHooks.configs.flat["recommended-latest"],
    reactRefresh.configs.vite,

    prettierConfig,
);
