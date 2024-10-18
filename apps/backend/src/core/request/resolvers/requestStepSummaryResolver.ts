import { entityResolver } from "@/core/entity/entityResolver";
import { getFlowName } from "@/core/flow/helpers/getFlowName";
import { hasReadPermission } from "@/core/permission/hasReadPermission";
import { permissionResolver } from "@/core/permission/permissionResolver";
import { RequestStepSummary } from "@/graphql/generated/resolver-types";

import { getEvolveRequestFlowName } from "../getEvolveRequestFlowName";
import { RequestStepSummaryPrismaType } from "../requestPrismaTypes";

export const requestStepSummaryResolver = ({
  requestStepSummary,
  identityIds,
  groupIds,
  userId,
}: {
  requestStepSummary: RequestStepSummaryPrismaType;
  identityIds: string[];
  groupIds: string[];
  userId: string | undefined;
}): RequestStepSummary => {
  const r = requestStepSummary;
  return {
    id: r.id,
    requestStepId: r.id,
    requestId: r.Request.id,
    flowId: r.Request.FlowVersion.Flow.id,
    requestName: r.Request.name,
    flowName:
      getEvolveRequestFlowName({
        proposedFlowVersion: r.Request.ProposedFlowVersionEvolution,
      }) ??
      getFlowName({
        flowName: r.Request.FlowVersion.name,
        ownerGroupName: r.Request.FlowVersion.Flow.OwnerGroup?.GroupCustom?.name,
        flowType: r.Request.FlowVersion.Flow.type,
      }),
    creator: entityResolver({ entity: r.Request.CreatorEntity, userIdentityIds: identityIds }),
    stepIndex: r.Step.index,
    totalSteps: r.Request.FlowVersion.totalSteps,
    createdAt: r.createdAt.toISOString(),
    expirationDate: r.expirationDate?.toISOString(),
    userResponded: r.Responses.length > 0,
    respondPermission: r.Step.ResponseConfig?.ResponsePermissions
      ? permissionResolver(r.Step.ResponseConfig?.ResponsePermissions, identityIds)
      : null,
    userRespondPermission: r.Step.ResponseConfig?.ResponsePermissions
      ? hasReadPermission({
          permission: r.Step.ResponseConfig?.ResponsePermissions,
          groupIds: groupIds,
          identityIds: identityIds,
          userId,
        })
      : false,
    status: {
      responseFinal: r.responseFinal,
      resultsFinal: r.resultsFinal,
      actionsFinal: r.actionsFinal,
      final: r.final,
    },
  };
};
