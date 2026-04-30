import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Inlined from @k-studio-pro/engine/vite (Node 22 can't strip TS types under
// node_modules, so we can't import the helper directly into vite.config.ts).
// Keep this in sync with node_modules/@k-studio-pro/engine/src/vite.ts.
function viteEngineAliases(projectRoot: string) {
  const dir = (sub: string) =>
    path.resolve(projectRoot, "node_modules/@k-studio-pro/engine/src", sub) + "/";
  const file = (f: string) =>
    path.resolve(projectRoot, "node_modules/@k-studio-pro/engine/src", f);
  return [
    { find: /^@\/blocks\//, replacement: dir("blocks") },
    { find: /^@\/engines\//, replacement: dir("engines") },
    { find: /^@\/lib\/siteDesign\//, replacement: dir("siteDesign") },
    { find: /^@\/types\//, replacement: dir("types") },
    { find: /^@\/blocks$/, replacement: file("blocks/index.ts") },
    { find: /^@\/engines$/, replacement: file("engines/index.ts") },
    { find: /^@\/lib\/siteDesign$/, replacement: file("siteDesign/index.ts") },
  ];
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  optimizeDeps: {
    include: ['jszip', 'swiper', 'swiper/react'],
  },
  resolve: {
    alias: [
      ...viteEngineAliases(__dirname),
      { find: "@", replacement: path.resolve(__dirname, "./src") },
    ],
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core", "swiper"],
  },
}));
