import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import nodePolyfills from "rollup-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
  },
  plugins: [react()],
  resolve: {
    alias: {
      stream: "rollup-plugin-node-polyfills/polyfills/stream",
      events: "rollup-plugin-node-polyfills/polyfills/events",
      assert: "assert",
      crypto: "crypto-browserify",
      util: "util",
    },
  },
  define: {
    "process.env": process.env ?? {},
  },
  build: {
    outDir: "build",
    target: "esnext",
    rollupOptions: {
      //@ts-ignore
      plugins: [nodePolyfills({ crypto: true })],
    },
    sourcemap: process.env.NODE_ENV === "production" ? false : 'inline',
  },
  optimizeDeps: {
    esbuildOptions: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      plugins: [NodeGlobalsPolyfillPlugin({ buffer: true }) as any],
    },
  },
});