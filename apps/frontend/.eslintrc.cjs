const { ignorePatterns } = require("../../.eslintrc.cjs");

/* eslint-env node */
module.exports = {
  extends: [
    "../../.eslintrc.cjs",
    "plugin:react/recommended", // Add React specific linting rules
  ],
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
  },
  env: {
    browser: true,
    es6: true,
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  plugins: ["react"],
  rules: {
    // Frontend-specific rules
    "react/prop-types": "off", // Disable prop-types as we use TypeScript for type checking
    "react/react-in-jsx-scope": "off", // Not needed with React 17+
  },
  ignorePatterns: ["vite.config.ts", "src/graphql/"],
};
