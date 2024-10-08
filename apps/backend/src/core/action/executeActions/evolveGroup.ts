import { Prisma } from "@prisma/client";

import { checkEntitiesForCustomGroups } from "@/core/entity/group/checkEntitiesForCustomGroups";
import { newEntitySet } from "@/core/entity/newEntitySet";
import { EvolveGroupFields } from "@/core/flow/evolveGroup/EvolveGroupFields";
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
      RequestFieldAnswers: { include: { Field: true, AnswerFreeInput: true } },
      Step: {
        include: {
          FlowVersion: {
            include: {
              Flow: {
                include: {
                  OwnerGroup: {
                    include: {
                      GroupCustom: true,
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

  const customGroupId = requestStep.Step.FlowVersion.Flow.OwnerGroup?.GroupCustom?.id;

  if (!customGroupId)
    throw new GraphQLError(`Cannot find custom group for request step ${requestStepId}`, {
      extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
    });

  const name = requestStep.RequestFieldAnswers.find((fieldAnswer) => {
    return fieldAnswer.Field.name === (EvolveGroupFields.Name as string);
  });
  const description = requestStep.RequestFieldAnswers.find((fieldAnswer) => {
    return fieldAnswer.Field.name === (EvolveGroupFields.Description as string);
  });

  const members = requestStep.RequestFieldAnswers.find((fieldAnswer) => {
    return fieldAnswer.Field.name === (EvolveGroupFields.Members as string);
  });

  /// validate members and create entity set for members ///

  if (!members) {
    throw new GraphQLError(
      `Cannot find members field for evolveGroup, request step ${requestStepId}`,
      {
        extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
      },
    );
  }

  const entityIds = JSON.parse(members.AnswerFreeInput[0].value) as string[];

  await checkEntitiesForCustomGroups({
    entityIds: entityIds,
    transaction,
  });

  const entitySetId = await newEntitySet({
    entityArgs: entityIds.map((id) => ({
      id,
    })),
    transaction,
  });

  await transaction.groupCustom.update({
    where: {
      id: customGroupId,
    },
    data: {
      name: name?.AnswerFreeInput[0].value ?? "",
      description: description?.AnswerFreeInput[0].value ?? "",
      entitySetId: entitySetId,
    },
  });
};
