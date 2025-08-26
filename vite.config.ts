import { defineConfig } from "vite";
import copy from "rollup-plugin-copy";

export default defineConfig({
  plugins: [
    copy({
      targets: [
        {
          // The Nutrient Web SDK requires its assets to be in the `public` directory so it can load them.
          src: "node_modules/@nutrient-sdk/viewer/dist/nutrient-viewer-lib",
          dest: "public/",
        },
      ],
      hook: "buildStart",
    }),
  ],
});