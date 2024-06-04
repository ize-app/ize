import { MetaMaskInpageProvider } from "@metamask/providers";

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CULTS_API_BASE_URL: string;
  readonly VITE_STYTCH_PUBLIC_TOKEN: string;
  readonly VITE_DISCORD_BOT_CLIENT_ID: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// interface Window {
//   ethereum: MetaMaskInpageProvider;
// }

declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider;
  }
}
