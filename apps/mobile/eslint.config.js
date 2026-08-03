import base from "@connosr/config/eslint.base.js";

export default [
  ...base,
  {
    ignores: ["expo-env.d.ts", "babel.config.js", "metro.config.js"],
  },
];
