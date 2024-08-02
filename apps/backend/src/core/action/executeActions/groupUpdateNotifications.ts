import { Prisma } from "@prisma/client";
import { z } from "zod";

import { GroupNotificationsFields } from "@/core/flow/groupUpdateNotifications/GroupNotificationsFields";
import { FieldDataType } from "@/graphql/generated/resolver-types";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { prisma } from "../../../prisma/client";

export const groupUpdateNotifications = async ({
  requestStepId,
  transaction = prisma,
}: {
  requestStepId: string;
  transaction?: Prisma.TransactionClient;
}): Promise<boolean> => {
  try {
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

    const webhook = requestStep.RequestFieldAnswers.find((fieldAnswer) => {
      return fieldAnswer.Field.name === GroupNotificationsFields.Webhook;
    });

    [webhook].forEach((field) => {
      if (!field) {
        throw new GraphQLError(
          `Cannot find field for groupUpdateNotifications request step ${requestStepId}`,
          {
            extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
          },
        );
      }
    });

    if (webhook?.AnswerFreeInput[0].dataType !== FieldDataType.Webhook)
      throw new GraphQLError(
        `Cannot find field for groupUpdateNotifications request step ${requestStepId}`,
        {
          extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
        },
      );

    const customGroupId = requestStep.Step.FlowVersion.Flow.OwnerGroup?.GroupCustom?.id;

    if (!customGroupId)
      throw new GraphQLError(`Cannot find custom group for request step ${requestStepId}`, {
        extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
      });

    const webhookId = z.string().uuid().safeParse(webhook.AnswerFreeInput[0].value).success
      ? webhook.AnswerFreeInput[0].value
      : null;

    await transaction.groupCustom.update({
      where: {
        id: customGroupId,
      },
      data: {
        notificationWebhookId: webhookId,
      },
    });

    return true;
  } catch (e) {
    return false;
  }
};
