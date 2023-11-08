import { RoleSummaryPartsFragment } from "../../../graphql/generated/graphql";
import { ProcessRights } from "../../NewProcess/newProcessWizard";
import { reformatAgentForAvatar } from "../../shared/Avatar";

export const formatRolesToFormState = (
  roles: RoleSummaryPartsFragment,
): ProcessRights => {
  return {
    request: roles.request.map((role) => reformatAgentForAvatar(role)),
    response: roles.respond.map((role) => reformatAgentForAvatar(role)),
    // edit: reformatAgentForAvatar(roles.edit as AgentSummaryPartsFragment),
    // @ts-ignore
    edit: undefined,
  };
};
