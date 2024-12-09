import { getActionName } from "@/core/action/getActionName";
import { getActionStatus } from "@/core/action/getActionStatus";
import { entityResolver } from "@/core/entity/entityResolver";
import { getFlowName } from "@/core/flow/helpers/getFlowName";
import { hasReadPermission } from "@/core/permission/hasReadPermission";
import { permissionResolver } from "@/core/permission/permissionResolver";
import { getResultConfigName } from "@/core/result/resolvers/getResultConfigName";
import { resultGroupResolver } from "@/core/result/resolvers/resultGroupResolver";
import { GraphqlRequestContext } from "@/graphql/context";
import {
  ActionStatus,
  RequestSummary,
  ResultGroupStatus,
} from "@/graphql/generated/resolver-types";

import { requestStepStatusResolver } from "./requestStepStatusResolver";
import { getEvolveRequestFlowName } from "../getEvolveRequestFlowName";
import { RequestSummaryPrismaType } from "../requestPrismaTypes";

export const requestSummaryResolver = ({
  requestSummary,
  groupIds,
  context,
}: {
  context: GraphqlRequestContext;
  groupIds: string[];
  requestSummary: RequestSummaryPrismaType;
}): RequestSummary => {
  const r = requestSummary;
  const currStep = r.CurrentRequestStep;
  if (!currStep) throw Error("Request does not have current request step");

  // const groupIds: string[] = await getGroupIdsOfUser({ user: context.currentUser });
  const identityIds: string[] = (context.currentUser?.Identities ?? []).map((id) => id.id) ?? [];

  const resultGroup = currStep.ResultGroups.find((rg) => rg.complete);
  const resultConfig = currStep.Step.ResultConfigSet?.ResultConfigs.find(
    (r) => r.id === resultGroup?.resultConfigId,
  );
  const field = (currStep.Step.ResponseFieldSet?.Fields ?? []).find(
    (f) => f.id === resultConfig?.fieldId,
  );

  const actionConfig = currStep.Step.ActionConfigSet?.ActionConfigs[0];

  const actionExecution = currStep.Actions.find((ae) => {
    return ae.actionConfigId === actionConfig?.id;
  });

  const actionSummary = actionConfig
    ? {
        name: getActionName({ action: actionConfig, ownerGroup: null }),
        status: getActionStatus({
          actionConfig: actionConfig,
          action: actionExecution,
          resultsFinal: currStep.resultsFinal,
          actionsFinal: currStep.actionsFinal,
        }),
      }
    : null;

  const result = resultGroup
    ? resultGroupResolver({
        resultGroup,
        responseFinal: currStep.responseFinal,
        resultsFinal: currStep.resultsFinal,
        context,
      })
    : null;

  const status = requestStepStatusResolver({
    requestStep: currStep,
    hasActionError: actionSummary?.status === ActionStatus.Error,
    hasResultsError: result?.status === ResultGroupStatus.Error,
  });

  const res: RequestSummary = {
    requestId: r.id,
    flowId: r.FlowVersion.Flow.id,
    requestName: r.name,
    flowName:
      getEvolveRequestFlowName({
        proposedFlowVersion: r.ProposedFlowVersionEvolution,
      }) ??
      getFlowName({
        flowName: r.FlowVersion.name,
        ownerGroupName: r.FlowVersion.Flow.OwnerGroup?.GroupIze?.name,
        flowType: r.FlowVersion.Flow.type,
      }),
    creator: entityResolver({ entity: r.CreatorEntity, userIdentityIds: identityIds }),
    createdAt: r.createdAt.toISOString(),
    status: r.final,
    currentStep: {
      requestStepId: currStep.id,
      status,
      fieldName: field?.name ?? "",
      resultName: resultConfig ? getResultConfigName({ resultConfig, field: undefined }) : "",
      expirationDate: currStep.expirationDate?.toISOString(),
      userResponded: currStep.Responses.length > 0,
      respondPermission: currStep.Step.ResponseConfig?.ResponsePermissions
        ? permissionResolver(currStep.Step.ResponseConfig?.ResponsePermissions, identityIds)
        : null,
      userRespondPermission: currStep.Step.ResponseConfig?.ResponsePermissions
        ? hasReadPermission({
            permission: currStep.Step.ResponseConfig?.ResponsePermissions,
            groupIds: groupIds,
            identityIds: identityIds,
            userId: context.currentUser?.id,
          })
        : false,
      result,
      action: actionSummary,
    },
  };

  return res;
};
