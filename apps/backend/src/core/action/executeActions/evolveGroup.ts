import { Prisma } from "@prisma/client";

import { checkEntitiesForIzeGroups } from "@/core/entity/group/checkEntitiesForCustomGroups";
import { newEntitySet } from "@/core/entity/newEntitySet";
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
          TriggerFieldAnswers: { include: { Field: true, AnswerFreeInput: true } },
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

  const izeGroupId = requestStep.Step.FlowVersion.Flow.OwnerGroup?.GroupIze?.id;

  if (!izeGroupId)
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

  if (!members || !members.AnswerFreeInput) {
    throw new GraphQLError(
      `Cannot find members field for evolveGroup, request step ${requestStepId}`,
      {
        extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
      },
    );
  }

  const entityIds = JSON.parse(members.AnswerFreeInput.value) as string[];

  await checkEntitiesForIzeGroups({
    entityIds: entityIds,
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
      id: izeGroupId,
    },
    data: {
      name: name?.AnswerFreeInput?.value ?? "",
      description: description?.AnswerFreeInput?.value ?? "",
      entitySetId: entitySetId,
    },
  });
};
