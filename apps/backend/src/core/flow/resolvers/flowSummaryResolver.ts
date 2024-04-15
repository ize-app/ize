import { FlowSummary } from "@/graphql/generated/resolver-types";
import { FlowSummaryPrismaType } from "../flowPrismaTypes";
import { GraphQLError, ApolloServerErrorCode } from "@graphql/errors";
import { permissionResolver } from "@/core/permission/permissionResolver";
import { hasReadPermission } from "@/core/permission/hasReadPermission";
import { userResolver } from "@/core/user/userResolver";

export const flowSummaryResolver = ({
  flow,
  identityIds,
  groupIds,
  userId,
}: {
  flow: FlowSummaryPrismaType;
  identityIds: string[];
  groupIds: string[];
  userId: string;
}): FlowSummary => {
  if (!flow.CurrentFlowVersion)
    throw new GraphQLError(`Missing flow version for flow. Flow Id: ${flow.id}`, {
      extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
    });

  if (!flow.CurrentFlowVersion.Steps[0])
    throw new GraphQLError(
      `Missing first step to flow version. flowVersionId: ${flow.CurrentFlowVersion}`,
      {
        extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
      },
    );

  return {
    flowId: flow.id,
    name: flow.CurrentFlowVersion?.name,
    createdAt: flow.createdAt.toISOString(),
    creator: userResolver(flow.Creator),
    requestStep0Permission: permissionResolver(
      flow.CurrentFlowVersion?.Steps[0].RequestPermissions,
      identityIds,
    ),
    userPermission: {
      request: hasReadPermission(
        flow.CurrentFlowVersion?.Steps[0].RequestPermissions,
        groupIds,
        identityIds,
        userId,
      ),
    },
  };
};
