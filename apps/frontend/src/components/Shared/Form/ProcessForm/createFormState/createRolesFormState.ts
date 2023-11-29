import { RoleSummaryPartsFragment } from "@/graphql/generated/graphql";
import { ProcessRights } from "@/components/shared/Form/ProcessForm/types";

import { reformatAgentForAvatar } from "@/components/shared/Avatar";

const createRolesFormState = (
  roles: RoleSummaryPartsFragment,
): ProcessRights => {
  return {
    request: roles.request.map((role) => reformatAgentForAvatar(role)),
    response: roles.respond.map((role) => reformatAgentForAvatar(role)),
  };
};

export default createRolesFormState;
