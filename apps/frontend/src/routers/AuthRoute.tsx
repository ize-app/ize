import { ReactNode, useContext } from "react";

import { CurrentUserContext } from "../contexts/current_user_context";

export const AuthRoute = ({ children }: { children: ReactNode }) => {
  const { user, userLoading } = useContext(CurrentUserContext);
  if ((user == null || user.discordData == null) && !userLoading) {
    location.href = "/api/auth/discord/login";
    return;
  }

  return children;
};
