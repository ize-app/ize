import { Option, Step } from "@/graphql/generated/resolver-types";
import { StepPrismaType } from "../flowPrismaTypes";
import { permissionResolver } from "../../permission/resolvers";
import { fieldSetResolver } from "../../fields/resolvers/fieldSetResolver";
import { actionResolver } from "../../action/resolvers";
import { hasReadPermission } from "../../permission/hasReadPermission";
import { resultsConfigSetResolver } from "@/flow/result/resolvers/resultConfigSetResolver";

export const stepResolver = ({
  step,
  userIdentityIds,
  userGroupIds,
  userId,
}: {
  step: StepPrismaType;
  userIdentityIds: string[];
  userGroupIds: string[];
  userId: string | undefined;
}): Step => {
  const responseFields = fieldSetResolver({ fieldSet: step.ResponseFieldSet });

  let responseOptions: Option[] | undefined = undefined;
  return {
    request: {
      permission: permissionResolver(step.RequestPermissions, userIdentityIds),
      fields: fieldSetResolver({ fieldSet: step.RequestFieldSet }),
    },
    response: {
      permission: permissionResolver(step.ResponsePermissions, userIdentityIds),
      fields: responseFields,
    },
    action: actionResolver(step.ActionNew, responseOptions),
    result: resultsConfigSetResolver(step.ResultConfigSet, responseFields),
    expirationSeconds: step.expirationSeconds,
    userPermission: {
      request: hasReadPermission(step.RequestPermissions, userIdentityIds, userGroupIds, userId),
      response: hasReadPermission(step.ResponsePermissions, userIdentityIds, userGroupIds, userId),
    },
  };
};
