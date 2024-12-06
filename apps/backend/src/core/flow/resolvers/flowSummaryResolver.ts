import { entityResolver } from "@/core/entity/entityResolver";
import { groupResolver } from "@/core/entity/group/groupResolver";
import { hasReadPermission } from "@/core/permission/hasReadPermission";
import { permissionResolver } from "@/core/permission/permissionResolver";
import { GraphqlRequestContext } from "@/graphql/context";
import { FlowSummary } from "@/graphql/generated/resolver-types";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { FlowSummaryPrismaType } from "../flowPrismaTypes";
import { watchingResolver } from "./watchingResolver";
import { getFlowName } from "../helpers/getFlowName";

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

  const triggerPermission = flow.CurrentFlowVersion.TriggerPermissions;

  if (!triggerPermission)
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
      ownerGroupName: flow.OwnerGroup?.GroupIze?.name,
    }),
    watching: watchingResolver({
      entityWatchedFlows: flow.EntityWatchedFlows,
    }),
    createdAt: flow.createdAt.toISOString(),
    creator: entityResolver({ entity: flow.CreatorEntity, userIdentityIds: identityIds }),
    trigger: {
      permission: permissionResolver(triggerPermission, identityIds),
      userPermission: hasReadPermission({
        permission: triggerPermission,
        groupIds,
        identityIds,
        userId,
      }),
    },
    group: flow.OwnerGroup ? groupResolver(flow.OwnerGroup) : null,
  };
};
