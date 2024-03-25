import { Option, Step } from "@/graphql/generated/resolver-types";
import { StepPrismaType } from "../flowPrismaTypes";
import { permissionResolver } from "../../permission/permissionResolver";
import { fieldSetResolver } from "../../fields/resolvers/fieldSetResolver";
import { resolveAction } from "../../action/resolveAction";
import { hasReadPermission } from "../../permission/hasReadPermission";
import { resultsConfigSetResolver } from "@/core/result/resolvers/resultConfigSetResolver";

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

  const result = resultsConfigSetResolver(step.ResultConfigSet, responseFields);

  let responseOptions: Option[] | undefined = undefined;
  return {
    index: step.index,
    request: {
      permission: permissionResolver(step.RequestPermissions, userIdentityIds),
      fields: fieldSetResolver({ fieldSet: step.RequestFieldSet }),
    },
    response: {
      permission: permissionResolver(step.ResponsePermissions, userIdentityIds),
      fields: responseFields,
    },
    action: resolveAction(step.Action, responseOptions),
    result,
    expirationSeconds: step.expirationSeconds,
    userPermission: {
      request: hasReadPermission(step.RequestPermissions, userIdentityIds, userGroupIds, userId),
      response: hasReadPermission(step.ResponsePermissions, userIdentityIds, userGroupIds, userId),
    },
  };
};
