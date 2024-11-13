import stytch, { Client as StytchClient } from "stytch";

import config from "@/config";

export const stytchClient: StytchClient = new stytch.Client({
  project_id: config.STYTCH_PROJECT_ID as string,
  secret: config.STYTCH_PROJECT_SECRET as string,
});

export const sessionDurationMinutes = 1440; // 24 hours
