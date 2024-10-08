import { StytchUIClient } from "@stytch/vanilla-js";

export const stytchClient = new StytchUIClient(import.meta.env.VITE_STYTCH_PUBLIC_TOKEN as string);
