import { Button, Typography } from "@mui/material";
import { LoginButton as TelegramLoginButton } from "@telegram-auth/react";

import { CopyToClipboardButton } from "@/components/CopyToClipboard";

export const TelegramBotSetup = () => {
  return (
    <>
      <TelegramLoginButton
        botUsername={"ize_app_bot"}
        authCallbackUrl="/api/auth/telegram"
        // onAuthCallback={async (data) => {
        //   console.log("sending data", data);

        //   await fetch("/api/auth/telegram", {
        //     method: "POST",
        //     headers: {
        //       "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify(data), // Send the URL parameters to the backend
        //   });
        // }}
        buttonSize="medium"
        cornerRadius={5} // 0 - 20
        showAvatar={true} // true | false
        lang="en"
      />
      <Button
        onClick={() => {
          window.open("https://t.me/ize_app_bot?startgroup=true", "_blank"); //.focus();
        }}
        sx={{ display: "flex" }}
        variant="contained"
      >
        Add Ize Bot
      </Button>
      <Typography variant="description">
        Send this slash command in the Discord group where you want to add the bot
      </Typography>
      <CopyToClipboardButton
        textComponent={
          <>
            <strong>/linkgroup</strong>
          </>
        }
      />
    </>
  );
  // login button
};
