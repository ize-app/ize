import { LoginButton as TelegramLoginButton } from "@telegram-auth/react";
const telegramBotName = import.meta.env.VITE_TELEGRAM_BOT_NAME as string;

export const TelegramLogin = () => {
  return (
    <TelegramLoginButton
      botUsername={telegramBotName}
      onAuthCallback={async (data) => {
        console.log("inside auth callback");
        await fetch("/api/auth/telegram", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data), // Send the URL parameters to the backend
        });
      }}
      buttonSize="medium"
      cornerRadius={5} // 0 - 20
      showAvatar={false} // true | false
      lang="en"
    />
  );
};
