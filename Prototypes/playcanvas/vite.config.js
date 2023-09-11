import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      // https://rollupjs.org/configuration-options/
      input: resolve(__dirname, "src/main.ts"),
      external: ["playcanvas"],
      output: {
        globals: {
          playcanvas: "pc",
        },
        format: "umd",
      },
    },
  },
});
