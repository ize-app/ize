import { useContext } from "react";

import UnauthenticatedHome2 from "./UnauthenticatedHome";
import { CurrentUserContext } from "../../hooks/contexts/current_user_context";
import { Requests } from "../Requests/Requests";

export const Home = () => {
  const { me } = useContext(CurrentUserContext);

  if (!me?.user) return <UnauthenticatedHome2 />;
  else {
    return <Requests />;
  }
};
