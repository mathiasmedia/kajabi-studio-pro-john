import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import type { Plugin } from "vite";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
//
// Thin-client vite config. Mirrors thin-client-templates/vite.config.ts
// from the master repo verbatim, except the engine helpers are inlined
// here instead of imported from `@k-studio-pro/engine/vite`. Reason:
// the engine package ships TypeScript source only (no compiled .js),
// and the Lovable dev-server's Node runtime cannot strip types from
// files inside node_modules — `import { ... } from "@k-studio-pro/engine/vite"`
// at config-load time crashes with ERR_UNSUPPORTED_NODE_MODULES_TYPE_STRIPPING.
//
// The inlined helpers below are byte-equivalent to the engine's
// `src/vite.ts` (viteEngineAliases + viteEngineZipPlugin). When the engine
// ships a compiled .js entrypoint for the /vite subpath, swap this back
// to: `import { viteEngineAliases, viteEngineZipPlugin } from "@k-studio-pro/engine/vite";`

// ─── Inlined: viteEngineAliases ────────────────────────────────────────
function engineDir(projectRoot: string, sub: string): string {
  return (
    path.resolve(projectRoot, "node_modules/@k-studio-pro/engine/src", sub) +
    "/"
  );
}
function engineFile(projectRoot: string, file: string): string {
  return path.resolve(
    projectRoot,
    "node_modules/@k-studio-pro/engine/src",
    file,
  );
}
function viteEngineAliases(projectRoot: string) {
  return [
    { find: /^@\/blocks\//, replacement: engineDir(projectRoot, "blocks") },
    { find: /^@\/engines\//, replacement: engineDir(projectRoot, "engines") },
    {
      find: /^@\/lib\/siteDesign\//,
      replacement: engineDir(projectRoot, "siteDesign"),
    },
    { find: /^@\/types\//, replacement: engineDir(projectRoot, "types") },
    {
      find: /^@\/blocks$/,
      replacement: engineFile(projectRoot, "blocks/index.ts"),
    },
    {
      find: /^@\/engines$/,
      replacement: engineFile(projectRoot, "engines/index.ts"),
    },
    {
      find: /^@\/lib\/siteDesign$/,
      replacement: engineFile(projectRoot, "siteDesign/index.ts"),
    },
  ];
}

// ─── Inlined: viteEngineZipPlugin ──────────────────────────────────────
// Makes the engine's `*.zip?url` base-theme imports survive esbuild
// dep-pre-bundling. Without this, esbuild stubs the four base-theme zip
// URLs to "" during pre-bundle, BASE_THEME_URLS ends up empty, and exports
// either fail or download a corrupt 1-byte zip. The historical "fix" was
// to copy zips into public/base-theme/ and override BASE_THEME_URLS at
// startup — DO NOT do that; this plugin is the proper fix.
function viteEngineZipPlugin(): Plugin {
  const PREFIX = "\0engine-zip-url:";
  let isBuild = false;
  return {
    name: "k-studio-engine-zip-url",
    enforce: "pre",
    configResolved(config) {
      isBuild = config.command === "build";
    },
    async resolveId(source, importer) {
      if (!source.endsWith(".zip?url")) return null;
      const withoutQuery = source.slice(0, -"?url".length);
      let absPath: string;
      if (path.isAbsolute(withoutQuery)) {
        absPath = withoutQuery;
      } else if (importer) {
        absPath = path.resolve(path.dirname(importer), withoutQuery);
      } else {
        return null;
      }
      if (!fs.existsSync(absPath)) return null;
      return PREFIX + absPath;
    },
    load(id) {
      if (!id.startsWith(PREFIX)) return null;
      const absPath = id.slice(PREFIX.length);
      if (isBuild) {
        // In build, emit the zip as a Rollup asset to get a hashed final URL.
        const referenceId = this.emitFile({
          type: "asset",
          name: path.basename(absPath),
          source: fs.readFileSync(absPath),
        });
        return `export default import.meta.ROLLUP_FILE_URL_${referenceId};`;
      }
      // In dev, re-export via Vite's native ?url handler on an /@fs path.
      return `export { default } from ${JSON.stringify("/@fs" + absPath + "?url")};`;
    },
  };
}

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    viteEngineZipPlugin(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    // Order matters: more-specific aliases must come before "@".
    alias: [
      ...viteEngineAliases(__dirname),
      {
        find: "@engine-auth",
        replacement: path.resolve(
          __dirname,
          "./node_modules/@k-studio-pro/engine/src/shell/hooks/useAuth.tsx",
        ),
      },
      { find: "@", replacement: path.resolve(__dirname, "./src") },
    ],
    // Dedupe is CRITICAL — without this, the engine package and the thin-client
    // app can each get their own copy of React / React Router, fragmenting
    // React contexts (most visibly: AuthProvider in the engine shell vs.
    // useAuth() called from a different React copy).
    dedupe: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "react-router-dom",
      "@tanstack/react-query",
      "@tanstack/query-core",
      "swiper",
      "@k-studio-pro/engine",
    ],
  },
  // Pre-bundle React + Router so Vite ships ONE copy across both the thin
  // client and the engine package's shell. DO NOT add the engine to
  // optimizeDeps.exclude — that brings the fragmentation back.
  optimizeDeps: {
    include: [
      "react",
      "react/jsx-runtime",
      "react-dom",
      "react-dom/client",
      "react-router-dom",
    ],
  },
}));
