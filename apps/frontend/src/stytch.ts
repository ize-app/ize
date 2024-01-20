import { StytchUIClient } from "@stytch/vanilla-js";

//@ts-ignore
export const stytchClient = new StytchUIClient(import.meta.env.VITE_STYTCH_PUBLIC_TOKEN);
