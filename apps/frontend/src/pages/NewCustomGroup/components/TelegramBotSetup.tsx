import { Typography } from "@mui/material";
import { LoginButton as TelegramLoginButton } from "@telegram-auth/react";
import { useContext } from "react";

import { AddTelegramBotButton } from "@/components/AddTelegramBotButton";
import { CopyToClipboardButton } from "@/components/CopyToClipboard";
import { SelectTelegramChat } from "@/components/Form/SelectTelegramChat";
import { CurrentUserContext } from "@/hooks/contexts/current_user_context";

import { GroupSetupAndPoliciesSchemaType } from "../formValidation";

export const TelegramBotSetup = () => {
  const { me } = useContext(CurrentUserContext);

  const telegramIdentity = me?.identities.find(
    (id) => id.identityType?.__typename === "IdentityTelegram",
  );

  return (
    <>
      {/* In local dev, you need to set bot's domain to 127.0.0.1:80 for FE button to work
      But the backend validation will fail if the bot's domain is not the same as the one set in the backend
      */}
      {!telegramIdentity && (
        <TelegramLoginButton
          botUsername={"ize_app_bot"}
          onAuthCallback={async (data) => {
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
          showAvatar={true} // true | false
          lang="en"
        />
      )}
      <Typography variant="description">First, add the Ize bot to your Telegram</Typography>
      <AddTelegramBotButton />
      <Typography variant="description">
        Send this slash command in the Telegram group where you want to add the bot
      </Typography>
      <CopyToClipboardButton
        textComponent={
          <>
            <strong>/linkgroup</strong>
          </>
        }
      />
      <Typography variant="description">
        Once you call the /linkgroup command, select the Telegram group below
      </Typography>
      <SelectTelegramChat<GroupSetupAndPoliciesSchemaType>
        label="Chat"
        name="notificationEntity"
        adminOnly={true}
      />
    </>
  );
  // login button
};
