import { LoginButton as TelegramLoginButton } from "@telegram-auth/react";
import { useContext } from "react";

import { CurrentUserContext } from "@/hooks/contexts/current_user_context";
const telegramBotName = import.meta.env.VITE_TELEGRAM_BOT_NAME as string;

export const TelegramLogin = () => {
  const { refetch } = useContext(CurrentUserContext);
  return (
    <TelegramLoginButton
      botUsername={telegramBotName}
      onAuthCallback={async (data) => {
        setTimeout(() => {
          if (refetch) refetch();
        }, 2000);

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
