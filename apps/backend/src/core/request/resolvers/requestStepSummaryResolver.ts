import { RequestStepSummary } from "@/graphql/generated/resolver-types";
import { RequestStepSummaryPrismaType } from "../requestPrismaTypes";
import { userResolver } from "@/core/user/userResolver";
import { permissionResolver } from "@/core/permission/permissionResolver";
import { hasReadPermission } from "@/core/permission/hasReadPermission";

export const requestStepSummaryResolver = ({
  requestStepSummary,
  identityIds,
  groupIds,
  userId,
}: {
  requestStepSummary: RequestStepSummaryPrismaType;
  identityIds: string[];
  groupIds: string[];
  userId: string;
}): RequestStepSummary => {
  const r = requestStepSummary;
  return {
    id: r.id,
    requestStepId: r.id,
    requestId: r.Request.id,
    flowId: r.Request.FlowVersion.Flow.id,
    requestName: r.Request.name,
    flowName: r.Request.FlowVersion.name,
    creator: userResolver(r.Request.Creator),
    stepIndex: r.Step.index,
    totalSteps: r.Request.FlowVersion.totalSteps,
    createdAt: r.createdAt.toISOString(),
    expirationDate: r.expirationDate?.toISOString(),
    responseComplete: r.responseComplete,
    resultsComplete: r.resultsComplete,
    actionsComplete: r.actionsComplete,
    final: r.final,
    respondPermission: permissionResolver(r.Step.ResponsePermissions, identityIds),
    userRespondPermission: hasReadPermission(
      r.Step.ResponsePermissions,
      groupIds,
      identityIds,
      userId,
    ),
  };
};
