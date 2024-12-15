import { Typography } from "@mui/material";
import { useContext } from "react";

import { AddTelegramBotButton } from "@/components/AddTelegramBotButton";
import { TelegramLogin } from "@/components/Auth/TelegramLogin";
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
      {!telegramIdentity && <TelegramLogin />}
      {telegramIdentity && (
        <>
          <Typography variant="description">First, add the Ize bot to a Telegram group</Typography>
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
            Once you call the /linkgroup command, select the Telegram group below. Dropdown only
            shows chats that have bot but don&apos;t yet have an Ize group
          </Typography>
          <SelectTelegramChat<GroupSetupAndPoliciesSchemaType>
            label="Chat"
            name="notificationEntity"
            adminOnly={true}
          />
        </>
      )}
    </>
  );
  // login button
};
