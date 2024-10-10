import { groupResolver } from "@/core/entity/group/groupResolver";
import { hasReadPermission } from "@/core/permission/hasReadPermission";
import { permissionResolver } from "@/core/permission/permissionResolver";
import { userResolver } from "@/core/user/userResolver";
import { GraphqlRequestContext } from "@/graphql/context";
import { FlowSummary } from "@/graphql/generated/resolver-types";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { FlowSummaryPrismaType } from "../flowPrismaTypes";
import { getFlowName } from "../helpers/getFlowName";
import { isWatchedFlowSummary } from "../helpers/isWatchedFlowSummary";

export const flowSummaryResolver = ({
  flow,
  context,
  groupIds,
}: {
  flow: FlowSummaryPrismaType;
  context: GraphqlRequestContext;
  groupIds: string[];
}): FlowSummary => {
  const userId = context.currentUser?.id;
  const identityIds = context.currentUser ? context.currentUser?.Identities.map((id) => id.id) : [];
  if (!flow.CurrentFlowVersion)
    throw new GraphQLError(`Missing flow version for flow. Flow Id: ${flow.id}`, {
      extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
    });

  if (!flow.CurrentFlowVersion.Steps[0])
    throw new GraphQLError(
      `Missing first step to flow version. flowVersionId: ${flow.CurrentFlowVersion.id}`,
      {
        extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
      },
    );

  const requestStep0Permission = flow.CurrentFlowVersion.Steps[0].RequestPermissions;

  if (!requestStep0Permission)
    throw new GraphQLError(
      `Missing first step to flow version. flowVersionId: ${flow.CurrentFlowVersion.id}`,
      {
        extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
      },
    );

  return {
    flowId: flow.id,
    name: getFlowName({
      flowName: flow.CurrentFlowVersion.name,
      flowType: flow.type,
      ownerGroupName: flow.OwnerGroup?.GroupCustom?.name,
    }),
    isWatched: context.currentUser
      ? isWatchedFlowSummary({ flowSummary: flow, user: context.currentUser })
      : false,
    createdAt: flow.createdAt.toISOString(),
    creator: userResolver(flow.Creator),
    requestStep0Permission: permissionResolver(requestStep0Permission, identityIds),
    group: flow.OwnerGroup ? groupResolver(flow.OwnerGroup) : null,
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
