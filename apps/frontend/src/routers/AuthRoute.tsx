import { ReactNode, useContext } from "react";

import { CurrentUserContext } from "../contexts/current_user_context";

export const AuthRoute = ({ children }: { children: ReactNode }) => {
  const { me, meLoading } = useContext(CurrentUserContext);
  if (me?.user == null && !meLoading) {
    location.href = "/api/auth/discord/login";
    return;
  }

  return children;
};
