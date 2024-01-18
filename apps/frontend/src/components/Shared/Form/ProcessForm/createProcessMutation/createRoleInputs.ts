import { ProcessRights } from "@/components/shared/Form/ProcessForm/types";
import { RoleArgs, RoleType } from "../../../../../graphql/generated/graphql";

const createRoleInputs = (rights: ProcessRights): RoleArgs[] => {
  const request = rights?.request.map((role) => ({
    id: role.id,
    type: RoleType.Request,
    agentType: role.__typename,
  })) as RoleArgs[];
  const response = rights?.response.map((role) => ({
    id: role.id,
    type: RoleType.Respond,
    agentType: role.__typename,
  })) as RoleArgs[];

  return request.concat(response);
};

export default createRoleInputs;
