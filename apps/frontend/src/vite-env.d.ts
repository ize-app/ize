/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CULTS_API_BASE_URL: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
