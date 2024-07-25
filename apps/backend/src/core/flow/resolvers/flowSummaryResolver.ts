import { hasReadPermission } from "@/core/permission/hasReadPermission";
import { permissionResolver } from "@/core/permission/permissionResolver";
import { userResolver } from "@/core/user/userResolver";
import { FlowSummary } from "@/graphql/generated/resolver-types";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { FlowSummaryPrismaType } from "../flowPrismaTypes";
import { getFlowName } from "../helpers/getFlowName";

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

  const requestStep0Permission = flow.CurrentFlowVersion.Steps[0].RequestPermissions;

  if (!requestStep0Permission)
    throw new GraphQLError(
      `Missing first step to flow version. flowVersionId: ${flow.CurrentFlowVersion}`,
      {
        extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
      },
    );

  return {
    flowId: flow.id,
    name: getFlowName({
      flowName: flow.CurrentFlowVersion.name,
      ownerGroupName: flow.OwnerGroup?.GroupCustom?.name,
    }),
    createdAt: flow.createdAt.toISOString(),
    creator: userResolver(flow.Creator),
    requestStep0Permission: permissionResolver(requestStep0Permission, identityIds),
    userPermission: {
      request: hasReadPermission({
        permission: flow.CurrentFlowVersion?.Steps[0].RequestPermissions,
        groupIds,
        identityIds,
        userId,
      }),
    },
  };
};
