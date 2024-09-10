import { AuthDataValidator } from "@telegram-auth/server";

export const telegramValidator = new AuthDataValidator({
  botToken: process.env.TELEGRAM_BOT_TOKEN,
});
