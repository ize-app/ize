import { telegramBot } from "./TelegramClient";

export const sendTelegramMessage = async ({
  chatId,
  message,
}: {
  chatId: string;
  message: string;
}) => {
  //   await telegramBot.telegram.sendMessage(chatId, message);
  telegramBot.telegram.sendMessage(chatId, message, {
    // reply_markup: {
    //   inline_keyboard: [
    //     [
    //       { text: "Option 1: This is arbitrarily long ", callback_data: "option_1" },
    //       {
    //         text: "Option 2: This one is even longer. Lets see how telegram handles this",
    //         callback_data: "option_2",
    //       },
    //     ],
    //     [{ text: "Visit Website", url: "https://example.com" }],
    //   ],
    // },
  });
};
