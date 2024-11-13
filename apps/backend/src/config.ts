import dotenv from "dotenv";

dotenv.config();

export default {
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  MODE: process.env.MODE,
  NODE_ENV: process.env.NODE_ENV,
  isDev: process.env.MODE === "development",
  PORT_FORWARDING_ADDRESS: process.env.PORT_FORWARDING_ADDRESS,
  PROD_URL: process.env.PROD_URL ?? "https://ize.space",
  CRON: process.env.CRON === "true",
  PORT: process.env.PORT ? Number(process.env.PORT) : 3000,
  HOST: process.env.HOST ?? "::1",
  ALCHEMY_API_KEY: process.env.ALCHEMY_API_KEY,
  DISCORD_IZE_BOT_API_TOKEN: process.env.DISCORD_IZE_BOT_API_TOKEN,
  PROD_RENDER_URL: process.env.PROD_RENDER_URL ?? "https://ize.onrender.com",
  LOCAL_URL: process.env.LOCAL_URL ?? "http://127.0.0.1",
  localProdBuildUrl: "http://127.0.0.1:3000",
  OPEN_AI_KEY: process.env.OPEN_AI_KEY,
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
  ENCRYPTION_IV: process.env.ENCRYPTION_IV,
  STYTCH_PROJECT_ID: process.env.STYTCH_PROJECT_ID,
  STYTCH_PROJECT_SECRET: process.env.STYTCH_PROJECT_SECRET,
};
