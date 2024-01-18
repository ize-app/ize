import { ProcessRights } from "@/components/shared/Form/ProcessForm/types";
import { RoleSummaryPartsFragment } from "@/graphql/generated/graphql";

const createRolesFormState = (roles: RoleSummaryPartsFragment): ProcessRights => {
  return {
    request: roles.request,
    response: roles.respond,
  };
};

export default createRolesFormState;
