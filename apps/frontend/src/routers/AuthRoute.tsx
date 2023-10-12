import { useContext, ReactNode, useEffect } from "react";

import { CurrentUserContext } from "../contexts/current_user_context";

export const AuthRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useContext(CurrentUserContext);

  //TODO: fix this code. user object doesn't load immediately so it keeps redirecting to auth
  if (user == null || user.discordData == null) {
    // location.href = "/api/auth/discord/login";
    return;
  }

  return children;
};
