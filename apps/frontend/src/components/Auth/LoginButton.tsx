import Button from "@mui/material/Button";
import { useContext } from "react";

import { CurrentUserContext } from "@/contexts/current_user_context";

export const LoginButton = () => {
  const { setAuthModalOpen } = useContext(CurrentUserContext);
  return (
    <Button
      onClick={() => {
        setAuthModalOpen(true);
      }}
      variant="outlined"
      color="secondary"
      sx={{ width: "160px" }}
    >
      Login
    </Button>
  );
};
