/* eslint-env node */
module.exports = {
  extends: ["../../.eslintrc.cjs"],
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
  },
  env: {
    node: true,
    es6: true,
  },
  rules: {
    // Backend-specific rules (if any)
  },
};
