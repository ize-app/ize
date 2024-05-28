// /* eslint-env node */

// module.exports = {
//   root: true,
//   env: { browser: true, es2020: true },
//   extends: [
//     "eslint:recommended",
//     "plugin:@typescript-eslint/recommended",
//     "plugin:@typescript-eslint/recommended-requiring-type-checking",
//     "plugin:react-hooks/recommended",
//     "plugin:prettier/recommended",
//     "prettier",
//     "plugin:import/recommended",
//     "plugin:import/typescript",
//   ],
//   parser: "@typescript-eslint/parser",
//   parserOptions: {
//     tsconfigRootDir: __dirname,
//     project: ["./tsconfig.json", "./apps/**/tsconfig.json"],
//   },
//   plugins: ["react-refresh", "@typescript-eslint", "prettier", "import"],

//   rules: {
//     "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
//     "@typescript-eslint/no-misused-promises": [
//       2,
//       {
//         checksVoidReturn: {
//           attributes: false,
//         },
//       },
//     ],
//     "@typescript-eslint/no-non-null-assertion": "off",
//     "@typescript-eslint/no-floating-promises": "off",
//     "@typescript-eslint/ban-ts-comment": "off",

//     // These errors seemed to not be working so I turned them off.
//     "@typescript-eslint/no-unsafe-member-access": "off",
//     "@typescript-eslint/no-unsafe-assignment": "off",
//     "@typescript-eslint/no-unsafe-argument": "off",
//     "@typescript-eslint/no-unsafe-call": "off",
//     "@typescript-eslint/no-redundant-type-constituents": "off",

//     "sort-imports": [
//       "error",
//       {
//         ignoreCase: false,
//         ignoreDeclarationSort: true, // don"t want to sort import lines, use eslint-plugin-import instead
//         ignoreMemberSort: false,
//         memberSyntaxSortOrder: ["none", "all", "multiple", "single"],
//         allowSeparatedGroups: true,
//       },
//     ],
//     // turn on errors for missing imports
//     "import/no-unresolved": "error",
//     "import/no-named-as-default-member": "off",
//     "import/order": [
//       "error",
//       {
//         groups: [
//           "builtin", // Built-in imports (come from NodeJS native) go first
//           "external", // <- External imports
//           "internal", // <- Absolute imports
//           ["sibling", "parent"], // <- Relative imports, the sibling and parent types they can be mingled together
//           "index", // <- index imports
//           "unknown", // <- unknown
//         ],
//         "newlines-between": "always",
//         alphabetize: {
//           /* sort in ascending order. Options: ["ignore", "asc", "desc"] */
//           order: "asc",
//           /* ignore case. Options: [true, false] */
//           caseInsensitive: true,
//         },
//       },
//     ],
//   },
//   settings: {
//     "import/parsers": {
//       "@typescript-eslint/parser": [".ts", ".tsx"],
//     },
//     // use tsconfigs of root project and packages to determine import resolution
//     "import/resolver": {
//       typescript: {
//         project: ["./tsconfig.json", "./apps/**/tsconfig.json", "./apps/**/tsconfig.node.json"],
//       },
//     },
//   },
// };
