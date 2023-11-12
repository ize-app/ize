import { RoleArgs, RoleType } from "../../../graphql/generated/graphql";
import { ProcessRights } from "../newProcessWizard";

export const formatRoles = (rights: ProcessRights): RoleArgs[] => {
  const request = rights?.request.map((role) => ({
    id: role.id,
    type: RoleType.Request,
    agentType: role.type,
  })) as RoleArgs[];
  const response = rights?.response.map((role) => ({
    id: role.id,
    type: RoleType.Respond,
    agentType: role.type,
  })) as RoleArgs[];

  return request.concat(response);
};
