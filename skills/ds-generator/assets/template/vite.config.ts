import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { componentTagger } from "lovable-tagger";

// Fails the build if any file under src/assets is 0 bytes (corrupted/missing upload).
function assetsIntegrityPlugin() {
  const roots = [path.resolve(__dirname, "src/assets")];
  const walk = (dir: string, out: string[] = []): string[] => {
    if (!fs.existsSync(dir)) return out;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full, out);
      else if (entry.isFile() && !entry.name.endsWith(".asset.json")) out.push(full);
    }
    return out;
  };
  return {
    name: "assets-integrity-check",
    buildStart() {
      const empty = roots
        .flatMap((r) => walk(r))
        .filter((f) => fs.statSync(f).size === 0)
        .map((f) => path.relative(__dirname, f));
      if (empty.length) {
        throw new Error(
          `[assets-integrity] ${empty.length} arquivo(s) de asset com 0 bytes detectado(s):\n` +
            empty.map((f) => `  - ${f}`).join("\n") +
            `\nReenvie esses arquivos ou remova-os antes de continuar o build.`,
        );
      }
    },
  };
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
  plugins: [
    react(),
    assetsIntegrityPlugin(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "es2020",
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000,
  },
}));
