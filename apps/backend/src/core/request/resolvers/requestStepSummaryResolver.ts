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
  return {
    id: requestStepSummary.id,
    requestStepId: requestStepSummary.id,
    requestId: requestStepSummary.Request.id,
    flowId: requestStepSummary.Request.FlowVersion.Flow.id,
    requestName: requestStepSummary.Request.name,
    flowName: requestStepSummary.Request.FlowVersion.name,
    creator: userResolver(requestStepSummary.Request.Creator),
    stepIndex: requestStepSummary.Step.index,
    totalSteps: requestStepSummary.Request.FlowVersion.totalSteps,
    createdAt: requestStepSummary.createdAt.toISOString(),
    expirationDate: requestStepSummary.expirationDate?.toISOString(),
    final: requestStepSummary.final,
    respondPermission: permissionResolver(requestStepSummary.Step.ResponsePermissions, identityIds),
    userRespondPermission: hasReadPermission(
      requestStepSummary.Step.ResponsePermissions,
      groupIds,
      identityIds,
      userId,
    ),
  };
};
