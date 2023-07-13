import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "../backend/src/graphql/**/*.graphql",
  documents: "./src/graphql/**/*.graphql",
  generates: {
    "src/graphql/generated/": {
      preset: "client",
      plugins: ["fragment-matcher", "typescript"]
    },
    "./src/graphql/graphql.schema.json": {
      plugins: ["introspection"]
    }
  }
};

export default config;
