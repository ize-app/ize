import { useLazyQuery } from "@apollo/client";
import { Button, Typography } from "@mui/material";
import { LoginButton as TelegramLoginButton } from "@telegram-auth/react";
import { useContext } from "react";

import { CopyToClipboardButton } from "@/components/CopyToClipboard";
import AsyncSelect from "@/components/Form/formFields/AsyncSelect";
import { EntityFragment, TelegramChatsDocument } from "@/graphql/generated/graphql";
import { CurrentUserContext } from "@/hooks/contexts/current_user_context";

import { GroupSetupAndPoliciesSchemaType } from "../formValidation";

export const TelegramBotSetup = () => {
  const { me } = useContext(CurrentUserContext);

  const telegramIdentity = me?.identities.find(
    (id) => id.identityType?.__typename === "IdentityTelegram",
  );

  const [getTelegramChats, { loading: telegramChatsLoading, data: telegramChats }] =
    useLazyQuery(TelegramChatsDocument);

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
      <Button
        onClick={() => {
          window.open("https://t.me/ize_app_bot?startgroup=true", "_blank"); //.focus();
        }}
        sx={{ display: "flex", width: "fit-content" }}
        variant="contained"
      >
        Add Ize Bot
      </Button>
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
      <AsyncSelect<GroupSetupAndPoliciesSchemaType, EntityFragment>
        label={"Telegram channel"}
        name="entity"
        getOptionLabel={(option) => option.name}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        loading={telegramChatsLoading}
        options={telegramChats?.telegramChats || []}
        fetchOptions={async () => {
          await getTelegramChats();
        }}
      />
    </>
  );
  // login button
};
