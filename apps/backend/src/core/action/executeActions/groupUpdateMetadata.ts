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

    const customGroupId = requestStep.Step.FlowVersion.Flow.OwnerGroup?.GroupCustom?.id;

    if (!customGroupId)
      throw new GraphQLError(`Cannot find custom group for request step ${requestStepId}`, {
        extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
      });

    await transaction.groupCustom.update({
      where: {
        id: customGroupId,
      },
      data: {
        name: name?.AnswerFreeInput[0].value,
        description: description?.AnswerFreeInput[0].value,
      },
    });

    return true;
  } catch (e) {
    return false;
  }
};
