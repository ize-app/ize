import { Prisma } from "@prisma/client";

import { checkEntitiesForIzeGroups } from "@/core/entity/group/checkEntitiesForCustomGroups";
import { newEntitySet } from "@/core/entity/newEntitySet";
import { upsertAllMemberEntitiesForIzeGroup } from "@/core/entity/updateEntitiesGroups/upsertAllEntitiesForIzeGroup";
import { SystemFieldType } from "@/graphql/generated/resolver-types";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { prisma } from "../../../prisma/client";

export const evolveGroup = async ({
  requestStepId,
  transaction = prisma,
}: {
  requestStepId: string;
  transaction?: Prisma.TransactionClient;
}) => {
  // find the current / proposed fields in the request
  const requestStep = await transaction.requestStep.findFirstOrThrow({
    include: {
      Request: {
        include: {
          TriggerFieldAnswers: {
            include: {
              Field: true,
              Value: {
                include: {
                  ValueEntities: true,
                },
              },
            },
          },
        },
      },
      Step: {
        include: {
          FlowVersion: {
            include: {
              Flow: {
                include: {
                  OwnerGroup: {
                    include: {
                      GroupIze: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    where: {
      id: requestStepId,
    },
  });

  const izeGroup = requestStep.Step.FlowVersion.Flow.OwnerGroup?.GroupIze;

  if (!izeGroup)
    throw new GraphQLError(`Cannot find custom group for request step ${requestStepId}`, {
      extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
    });

  const requestFieldAnswers = requestStep.Request.TriggerFieldAnswers;

  const name = requestFieldAnswers.find((fieldAnswer) => {
    return fieldAnswer.Field.systemType === SystemFieldType.GroupName;
  });
  const description = requestFieldAnswers.find((fieldAnswer) => {
    return fieldAnswer.Field.systemType === SystemFieldType.GroupDescription;
  });

  const members = requestFieldAnswers.find((fieldAnswer) => {
    return fieldAnswer.Field.systemType === SystemFieldType.GroupMembers;
  });

  /// validate members and create entity set for members ///

  if (!members || !members.Value.ValueEntities) {
    throw new GraphQLError(
      `Cannot find members field for evolveGroup, request step ${requestStepId}`,
      {
        extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
      },
    );
  }

  const entityIds = members.Value.ValueEntities.map((entity) => entity.entityId);

  await checkEntitiesForIzeGroups({
    entityIds: entityIds,
    transaction,
  });

  await upsertAllMemberEntitiesForIzeGroup({
    entityIds,
    groupId: izeGroup.groupId,
    transaction,
  });

  const entitySetId = await newEntitySet({
    entityArgs: entityIds.map((id) => ({
      id,
    })),
    transaction,
  });

  await transaction.groupIze.update({
    where: {
      id: izeGroup.id,
    },
    data: {
      name: name?.Value.string ?? "",
      description: description?.Value.string ?? "",
      entitySetId: entitySetId,
    },
  });
};
