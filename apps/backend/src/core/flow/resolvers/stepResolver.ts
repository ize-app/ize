import { Field, ResultConfig, Step } from "@/graphql/generated/resolver-types";
import { StepPrismaType } from "../flowPrismaTypes";
import { permissionResolver } from "../../permission/permissionResolver";
import { fieldSetResolver } from "../../fields/resolvers/fieldSetResolver";
import { actionResolver } from "../../action/actionResolver";
import { hasReadPermission } from "../../permission/hasReadPermission";
import { resultsConfigSetResolver } from "@/core/result/resolvers/resultConfigSetResolver";

export const stepResolver = ({
  step,
  userIdentityIds,
  userGroupIds,
  userId,
  responseFieldsCache,
  resultConfigsCache,
}: {
  step: StepPrismaType;
  userIdentityIds: string[];
  userGroupIds: string[];
  userId: string | undefined;
  responseFieldsCache: Field[];
  resultConfigsCache: ResultConfig[];
}): Step => {
  const responseFields = fieldSetResolver({
    fieldSet: step.ResponseFieldSet,
    responseFieldsCache,
    resultConfigsCache,
  });
  responseFieldsCache.push(...responseFields);

  const result = resultsConfigSetResolver(step.ResultConfigSet, responseFields);
  resultConfigsCache.push(...result);

  return {
    id: step.id,
    index: step.index,
    request: {
      permission: permissionResolver(step.RequestPermissions, userIdentityIds),
      fields: fieldSetResolver({
        fieldSet: step.RequestFieldSet,
        responseFieldsCache,
        resultConfigsCache,
      }),
    },
    response: {
      permission: permissionResolver(step.ResponsePermissions, userIdentityIds),
      fields: responseFields,
    },
    action: actionResolver(step.Action, responseFieldsCache),
    result,
    expirationSeconds: step.expirationSeconds,
    allowMultipleResponses: step.allowMultipleResponses,
    userPermission: {
      request: hasReadPermission({
        permission: step.RequestPermissions,
        identityIds: userIdentityIds,
        groupIds: userGroupIds,
        userId,
      }),
      response: hasReadPermission({
        permission: step.ResponsePermissions,
        identityIds: userIdentityIds,
        groupIds: userGroupIds,
        userId,
      }),
    },
  };
};
