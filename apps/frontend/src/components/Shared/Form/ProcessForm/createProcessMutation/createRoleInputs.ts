import { ProcessRights } from "../../../../NewProcess/newProcessWizard";
import { RoleArgs, RoleType } from "../../../../../graphql/generated/graphql";

const createRoleInputs = (rights: ProcessRights): RoleArgs[] => {
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

export default createRoleInputs;
