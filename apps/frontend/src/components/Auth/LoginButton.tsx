import Button, { ButtonProps } from "@mui/material/Button";
import { useContext } from "react";

import { CurrentUserContext } from "@/contexts/current_user_context";
export const LoginButton = (props: ButtonProps) => {
  const { setAuthModalOpen } = useContext(CurrentUserContext);
  return (
    <Button
      onClick={() => {
        setAuthModalOpen(true);
      }}
      variant="outlined"
      color="secondary"
      size="small"
      {...props}
    >
      Login
    </Button>
  );
};
