import { entityResolver } from "@/core/entity/entityResolver";
import { getFlowName } from "@/core/flow/helpers/getFlowName";
import { hasReadPermission } from "@/core/permission/hasReadPermission";
import { permissionResolver } from "@/core/permission/permissionResolver";
import { RequestSummary } from "@/graphql/generated/resolver-types";

import { getEvolveRequestFlowName } from "../getEvolveRequestFlowName";
import { RequestSummaryPrismaType } from "../requestPrismaTypes";

export const requestSummaryResolver = ({
  requestSummary: requestSummary,
  identityIds,
  groupIds,
  userId,
}: {
  requestSummary: RequestSummaryPrismaType;
  identityIds: string[];
  groupIds: string[];
  userId: string | undefined;
}): RequestSummary => {
  const r = requestSummary;
  if (!r.CurrentRequestStep) throw Error("Request does not have current request step");
  return {
    id: r.id,
    requestStepId: r.id,
    requestId: r.id,
    flowId: r.FlowVersion.Flow.id,
    requestName: r.name,
    flowName:
      getEvolveRequestFlowName({
        proposedFlowVersion: r.ProposedFlowVersionEvolution,
      }) ??
      getFlowName({
        flowName: r.FlowVersion.name,
        ownerGroupName: r.FlowVersion.Flow.OwnerGroup?.GroupCustom?.name,
        flowType: r.FlowVersion.Flow.type,
      }),
    creator: entityResolver({ entity: r.CreatorEntity, userIdentityIds: identityIds }),
    stepIndex: 0, // TODO remove this
    totalSteps: r.FlowVersion.totalSteps,
    createdAt: r.createdAt.toISOString(),
    expirationDate: r.CurrentRequestStep.expirationDate?.toISOString(),
    userResponded: r.CurrentRequestStep.Responses.length > 0,
    respondPermission: r.CurrentRequestStep.Step.ResponseConfig?.ResponsePermissions
      ? permissionResolver(
          r.CurrentRequestStep.Step.ResponseConfig?.ResponsePermissions,
          identityIds,
        )
      : null,
    userRespondPermission: r.CurrentRequestStep.Step.ResponseConfig?.ResponsePermissions
      ? hasReadPermission({
          permission: r.CurrentRequestStep.Step.ResponseConfig?.ResponsePermissions,
          groupIds: groupIds,
          identityIds: identityIds,
          userId,
        })
      : false,
    status: {
      responseFinal: r.CurrentRequestStep.responseFinal,
      resultsFinal: r.CurrentRequestStep.resultsFinal,
      actionsFinal: r.CurrentRequestStep.actionsFinal,
      final: r.final,
    },
  };
};
