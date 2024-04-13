import { useContext } from "react";

import Button from "@mui/material/Button";
import { CurrentUserContext } from "@/contexts/current_user_context";

export const LoginButton = () => {
  const { setAuthModalOpen } = useContext(CurrentUserContext);
  return (
    <Button onClick={() => setAuthModalOpen(true)} variant="outlined" color="secondary">
      Login
    </Button>
  );
};
