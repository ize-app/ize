import { Prisma } from "@prisma/client";

import { groupResolver } from "@/core/entity/group/groupResolver";
import { fieldSetResolver } from "@/core/fields/resolvers/fieldSetResolver";
import { hasReadPermission } from "@/core/permission/hasReadPermission";
import { permissionResolver } from "@/core/permission/permissionResolver";
import { GraphqlRequestContext } from "@/graphql/context";
import { Field, Flow, FlowType, Group, ResultConfig } from "@/graphql/generated/resolver-types";
import { prisma } from "@/prisma/client";

import { stepResolver } from "./stepResolver";
import { FlowVersionPrismaType } from "../flowPrismaTypes";
import { DefaultEvolveGroupValues, getDefaultFlowValues } from "../helpers/getDefaultFlowValues";
import { getFlowName } from "../helpers/getFlowName";
import { isWatchedFlow } from "../helpers/isWatchedFlow";

export const flowResolver = async ({
  flowVersion,
  evolveFlow,
  userIdentityIds,
  userGroupIds,
  userId,
  flowNameOverride,
  responseFieldsCache = [],
  resultConfigsCache = [],
  context,
  transaction = prisma,
}: {
  flowVersion: FlowVersionPrismaType;
  evolveFlow?: FlowVersionPrismaType;
  userIdentityIds: string[];
  userGroupIds: string[];
  userId: string | undefined;
  flowNameOverride?: string;
  responseFieldsCache?: Field[];
  resultConfigsCache?: ResultConfig[];
  context: GraphqlRequestContext;
  transaction?: Prisma.TransactionClient;
}): Promise<Flow> => {
  const defaultValues: DefaultEvolveGroupValues | undefined = await getDefaultFlowValues({
    flowVersion,
    context,
  });

  const ownerGroup: Group | null = flowVersion.Flow.OwnerGroup
    ? groupResolver(flowVersion.Flow.OwnerGroup)
    : null;

  return {
    __typename: "Flow",
    id: flowVersion.Flow.id,
    flowId: flowVersion.Flow.id,
    flowVersionId: flowVersion.id,
    group: ownerGroup,
    currentFlowVersionId: flowVersion.Flow.currentFlowVersionId,
    createdAt: flowVersion.Flow.createdAt.toISOString(),
    versionCreatedAt: flowVersion.createdAt.toISOString(),
    versionPublishedAt: flowVersion.publishedAt && flowVersion.publishedAt.toISOString(),
    active: flowVersion.active,
    type: flowVersion.Flow.type as FlowType,
    reusable: flowVersion.Flow.reusable,
    isWatched: isWatchedFlow({ flowVersion: flowVersion, user: context.currentUser }),
    trigger: {
      permission: permissionResolver(flowVersion.TriggerPermissions, userIdentityIds),
      userPermission: hasReadPermission({
        permission: flowVersion.TriggerPermissions,
        identityIds: userIdentityIds,
        groupIds: userGroupIds,
        userId,
      }),
    },
    fieldSet: fieldSetResolver({
      fieldSet: flowVersion.TriggerFieldSet,
      defaultValues,
    }),
    name: getFlowName({
      flowName: flowVersion.name,
      flowType: flowVersion.Flow.type,
      ownerGroupName: flowVersion.Flow.OwnerGroup?.GroupCustom?.name,
      flowNameOverride,
    }),
    flowsEvolvedByThisFlow: flowVersion.Flow.EvolveRightsForFlowVersions.filter(
      (fv) => fv.active && fv.Flow.type !== FlowType.Evolve,
    ).map((fv) => ({
      flowName: fv.name,
      flowId: fv.Flow.id,
    })),
    steps: flowVersion.Steps.map((step) =>
      stepResolver({
        step,
        userIdentityIds,
        userGroupIds,
        userId,
        responseFieldsCache,
        resultConfigsCache,
        ownerGroup: ownerGroup,
      }),
    ).sort((a, b) => a.index - b.index),
    evolve: evolveFlow
      ? await flowResolver({
          flowVersion: evolveFlow,
          userIdentityIds,
          userGroupIds,
          userId,
          transaction,
          context,
        })
      : null,
  };
};
