import { useContext } from "react";

import { CurrentUserContext } from "@/contexts/current_user_context";
import { AgentSummaryPartsFragment } from "@/graphql/generated/graphql";

export const hasPermission = (processRoles: AgentSummaryPartsFragment[] | undefined) => {
  const { me } = useContext(CurrentUserContext);
  if (!me?.identities || !processRoles) return false;
  return processRoles.some((role) => {
    if (role.__typename === "Identity") {
      if (me.identities.some((identity) => identity.id === role.id)) return true;
    } else if (role.__typename === "Group") {
      if ((me.groupIds ?? []).some((groupId) => groupId === role.id)) return true;
    }
    return false;
  });
};
