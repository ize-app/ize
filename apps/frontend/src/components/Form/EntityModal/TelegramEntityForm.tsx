import { Button, Typography } from "@mui/material";
import { useFormContext } from "react-hook-form";

import { telegramBotInviteUrl } from "@/components/Auth/telegramBotInviteUrl";
import { EntitySummaryPartsFragment } from "@/graphql/generated/graphql";

import { NewEntitySchemaType } from "../formValidation/entity";
import { SelectTelegramChat } from "../SelectTelegramChat";

interface TelegramEntityFormProps {
  handleEntitySelection: (entities: EntitySummaryPartsFragment[]) => void;
}

// Telegram chat entity is created when ize bot is added so this handler doesn't need to create mutation
export const TelegramEntityForm = ({ handleEntitySelection }: TelegramEntityFormProps) => {
  const { watch } = useFormContext<NewEntitySchemaType>();

  const telegramChat = watch("telegramChat") as EntitySummaryPartsFragment | undefined;
  return (
    <>
      <SelectTelegramChat<NewEntitySchemaType>
        label="Select Telegram Chat"
        name="telegramChat"
        adminOnly={false}
      />

      <Typography>
        Don&apos;t see your chat?{" "}
        <a href={telegramBotInviteUrl} target="_blank" rel="noopener noreferrer">
          Add the Ize bot
        </a>{" "}
      </Typography>
      <Button
        onClick={() => handleEntitySelection(telegramChat ? [telegramChat] : [])}
        variant="contained"
        sx={{ width: "200px" }}
      >
        Submit
      </Button>
    </>
  );
};
