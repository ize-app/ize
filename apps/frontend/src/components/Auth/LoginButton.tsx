import Button, { ButtonProps } from "@mui/material/Button";
import { useContext } from "react";

import { CurrentUserContext } from "@/hooks/contexts/current_user_context";
export const LoginButton = (props: ButtonProps) => {
  const { setAuthModalOpen } = useContext(CurrentUserContext);
  return (
    <Button
      onClick={() => {
        setAuthModalOpen(true);
      }}
      variant="contained"
      color="primary"
      size="small"
      {...props}
    >
      {props.children ?? "Login"}
    </Button>
  );
};
