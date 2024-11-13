import { AuthDataValidator } from "@telegram-auth/server";

import config from "@/config";

export const telegramValidator = new AuthDataValidator({
  botToken: config.TELEGRAM_BOT_TOKEN,
});
