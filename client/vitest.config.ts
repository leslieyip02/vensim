import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        coverage: {
            provider: "v8",
            reportsDirectory: "coverage",
            include: ["src/**/*.{ts,tsx,js,jsx}"],
            exclude: ["**/*.test.{ts,tsx}", "**/node_modules/**", "src/components/ui/**"],
        },
    },
});
