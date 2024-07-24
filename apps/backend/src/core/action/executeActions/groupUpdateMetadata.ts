import { Prisma } from "@prisma/client";

import { GroupMetadataFields } from "@/core/flow/groupUpdateMetadata/GroupMetdataFields";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { prisma } from "../../../prisma/client";

export const groupUpdateMetadata = async ({
  requestStepId,
  transaction = prisma,
}: {
  requestStepId: string;
  transaction?: Prisma.TransactionClient;
}): Promise<boolean> => {
  try {
    console.log;
    // find the current / proposed fields in the request
    const requestStep = await transaction.requestStep.findFirstOrThrow({
      include: {
        RequestFieldAnswers: { include: { Field: true, AnswerFreeInput: true } },
        Step: {
          include: {
            FlowVersion: {
              include: {
                Flow: true,
              },
            },
          },
        },
      },
      where: {
        id: requestStepId,
      },
    });

    const name = requestStep.RequestFieldAnswers.find((fieldAnswer) => {
      return fieldAnswer.Field.name === GroupMetadataFields.Name;
    });
    const description = requestStep.RequestFieldAnswers.find((fieldAnswer) => {
      return fieldAnswer.Field.name === GroupMetadataFields.Description;
    });

    [name, description].forEach((field) => {
      if (!field) {
        throw new GraphQLError(
          `Cannot find field for groupUpdateMetadata request step ${requestStepId}`,
          {
            extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
          },
        );
      }
    });

    const groupId = requestStep.Step.FlowVersion.Flow.groupId;

    if (!groupId)
      throw new GraphQLError(`Cannot find group for request step ${requestStepId}`, {
        extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
      });

    await transaction.group.update({
      where: {
        id: groupId,
      },
      data: {
        GroupCustom: {
          update: {
            name: name?.AnswerFreeInput[0].value,
            description: description?.AnswerFreeInput[0].value,
          },
        },
      },
    });

    return true;
  } catch (e) {
    return false;
  }
};
