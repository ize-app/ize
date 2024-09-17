import { Button } from "@mui/material";
import { useFormContext } from "react-hook-form";

import { EntitySummaryPartsFragment } from "@/graphql/generated/graphql";

import { ResponsiveFormRow } from "../formLayout/ResponsiveFormRow";
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
      <ResponsiveFormRow>
        <SelectTelegramChat<NewEntitySchemaType> label="Chat" name="telegramChat" />
      </ResponsiveFormRow>
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
