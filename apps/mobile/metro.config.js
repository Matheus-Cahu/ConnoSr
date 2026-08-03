const { getDefaultConfig } = require("expo/metro-config");
const { resolve } = require("metro-resolver");
const path = require("node:path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// pnpm workspaces store dependencies as symlinks; Metro needs to watch the
// monorepo root and resolve node_modules from both the app and the root.
config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];
config.resolver.unstable_enableSymlinks = true;
config.resolver.disableHierarchicalLookup = true;

// The shared @connosr/* packages use Node-ESM-style relative imports
// (`./http.js`) so they run unbundled under Node's ESM loader (apps/api) and
// still typecheck under NodeNext. Unlike Vite/tsc, Metro resolves import
// specifiers literally and won't map a `.js` specifier to a sibling `.ts`
// source file, so failed `.js` resolutions are retried against `.ts`/`.tsx`.
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName.startsWith(".") && moduleName.endsWith(".js")) {
    try {
      return resolve(context, moduleName, platform);
    } catch {
      const withoutExtension = moduleName.slice(0, -".js".length);
      for (const extension of [".ts", ".tsx"]) {
        try {
          return resolve(context, withoutExtension + extension, platform);
        } catch {
          // try the next extension
        }
      }
      throw new Error(`Could not resolve ${moduleName} (also tried .ts/.tsx)`);
    }
  }
  return resolve(context, moduleName, platform);
};

module.exports = config;
