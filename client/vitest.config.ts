import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    test: {
        coverage: {
            provider: "v8",
            reportsDirectory: "coverage",
            include: ["src/**/*.{ts,tsx,js,jsx}"],
            exclude: ["**/*.test.{ts,tsx}", "**/node_modules/**", "src/components/ui/**"],
        },
    },
});
