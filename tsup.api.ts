import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    server: "server.ts",
  },
  format: ["esm"],
  target: "es2022",
  outDir: "dist/api",
  clean: true,
});
