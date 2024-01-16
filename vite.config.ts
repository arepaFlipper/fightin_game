import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
  },
  build: {
  },
  plugins:[
    viteStaticCopy({
      targets: [
        { src: "img", dest: "." },
      ]
    })
  ]
});
