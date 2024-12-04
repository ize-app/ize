import { resultsConfigSetResolver } from "@/core/result/resolvers/resultConfigSetResolver";
import { GraphqlRequestContext } from "@/graphql/context";
import { Field, Group, ResultConfig, Step } from "@/graphql/generated/resolver-types";

import { actionConfigResolver } from "../../action/actionConfigResolver";
import { fieldSetResolver } from "../../fields/resolvers/fieldSetResolver";
import { hasReadPermission } from "../../permission/hasReadPermission";
import { permissionResolver } from "../../permission/permissionResolver";
import { StepPrismaType } from "../flowPrismaTypes";
import { DefaultEvolveGroupValues } from "../helpers/getDefaultFlowValues";

export const stepResolver = ({
  step,
  userIdentityIds,
  userGroupIds,
  userId,
  responseFieldsCache,
  resultConfigsCache,
  ownerGroup,
  context,
}: {
  step: StepPrismaType;
  userIdentityIds: string[];
  userGroupIds: string[];
  userId: string | undefined;
  responseFieldsCache: Field[];
  resultConfigsCache: ResultConfig[];
  ownerGroup: Group | null;
  hideSensitiveInfo?: boolean;
  defaultValues?: DefaultEvolveGroupValues | undefined;
  context: GraphqlRequestContext;
}): Step => {
  const responseFields = fieldSetResolver({
    fieldSet: step.ResponseFieldSet,
    responseFieldsCache,
    resultConfigsCache,
    context,
  });
  responseFieldsCache.push(...responseFields.fields);

  const result = resultsConfigSetResolver(step.ResultConfigSet, responseFields.fields);
  resultConfigsCache.push(...result);

  return {
    id: step.id,
    index: step.index,
    fieldSet: responseFields,
    response: step.ResponseConfig
      ? {
          permission: permissionResolver(step.ResponseConfig.ResponsePermissions, userIdentityIds),

          userPermission: hasReadPermission({
            permission: step.ResponseConfig.ResponsePermissions,
            identityIds: userIdentityIds,
            groupIds: userGroupIds,
            userId,
          }),
          canBeManuallyEnded: step.ResponseConfig.canBeManuallyEnded,
          expirationSeconds: step.ResponseConfig.expirationSeconds,
          allowMultipleResponses: step.ResponseConfig.allowMultipleResponses,
          minResponses: step.ResponseConfig.minResponses,
        }
      : undefined,
    action: actionConfigResolver({
      actionConfig: step.ActionConfigSet?.ActionConfigs[0],
      resultConfigs: result,
      responseFields: responseFieldsCache,
      ownerGroup,
    }),
    result,
  };
};
