import { Button } from "@mui/material";

import { telegramBotInviteUrl } from "./Auth/telegramBotInviteUrl";

export const AddTelegramBotButton = () => {
  return (
    <Button
      onClick={() => {
        window.open(telegramBotInviteUrl, "_blank"); //.focus();
      }}
      sx={{ display: "flex", width: "fit-content" }}
      variant="contained"
    >
      Add Ize Bot to Telegram Group
    </Button>
  );
};
