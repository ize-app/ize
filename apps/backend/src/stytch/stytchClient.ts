import stytch, { Client as StytchClient } from "stytch";

export const stytchClient: StytchClient = new stytch.Client({
  project_id: process.env.STYTCH_PROJECT_ID as string,
  secret: process.env.STYTCH_PROJECT_SECRET as string,
});

export const sessionDurationMinutes = 1440; // 24 hours
