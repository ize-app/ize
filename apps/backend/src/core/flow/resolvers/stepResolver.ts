import { resultsConfigSetResolver } from "@/core/result/resolvers/resultConfigSetResolver";
import { Field, ResultConfig, Step } from "@/graphql/generated/resolver-types";

import { DefaultEvolveGroupValues } from "./flowResolver";
import { actionResolver } from "../../action/actionResolver";
import { fieldSetResolver } from "../../fields/resolvers/fieldSetResolver";
import { hasReadPermission } from "../../permission/hasReadPermission";
import { permissionResolver } from "../../permission/permissionResolver";
import { StepPrismaType } from "../flowPrismaTypes";

export const stepResolver = ({
  step,
  userIdentityIds,
  userGroupIds,
  userId,
  responseFieldsCache,
  resultConfigsCache,
  defaultValues,
}: {
  step: StepPrismaType;
  userIdentityIds: string[];
  userGroupIds: string[];
  userId: string | undefined;
  responseFieldsCache: Field[];
  resultConfigsCache: ResultConfig[];
  hideSensitiveInfo?: boolean;
  defaultValues?: DefaultEvolveGroupValues | undefined;
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
      permission: step.RequestPermissions
        ? permissionResolver(step.RequestPermissions, userIdentityIds)
        : null,
      fields: fieldSetResolver({
        fieldSet: step.RequestFieldSet,
        responseFieldsCache,
        resultConfigsCache,
        defaultValues,
      }),
      fieldsLocked: step.RequestFieldSet?.locked ?? false,
    },
    response: {
      permission: step.ResponsePermissions
        ? permissionResolver(step.ResponsePermissions, userIdentityIds)
        : null,
      fields: responseFields,
      fieldsLocked: step.ResponseFieldSet?.locked ?? false,
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
