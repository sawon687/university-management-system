import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],

  format: ["esm"],

  platform: "node",
  target: "node26",

  outDir: "dist",
  clean: true,

  bundle: true,
  splitting: false,
  sourcemap: true,

  external: ["dotenv"],
});
