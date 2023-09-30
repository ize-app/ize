import { useContext, ReactNode } from "react";

import { CurrentUserContext } from "../contexts/current_user_context";

export const AuthRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useContext(CurrentUserContext);

  if (user == null || user.discordData == null) {
    location.href = "/api/auth/discord/login";
    return;
  }

  return children;
};
