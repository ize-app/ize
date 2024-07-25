import { Prisma } from "@prisma/client";

import { checkEntitiesForCustomGroups } from "@/core/entity/group/checkEntitiesForCustomGroups";
import { newEntitySet } from "@/core/entity/newEntitySet";
import { GroupMembershipFields } from "@/core/flow/groupUpdateMembership/GroupMembershipFields";
import { FieldDataType } from "@/graphql/generated/resolver-types";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { prisma } from "../../../prisma/client";

export const groupUpdateMembership = async ({
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

    const members = requestStep.RequestFieldAnswers.find((fieldAnswer) => {
      return fieldAnswer.Field.name === GroupMembershipFields.Members;
    });

    [members].forEach((field) => {
      if (!field) {
        throw new GraphQLError(
          `Cannot find field for groupUpdateMetadata request step ${requestStepId}`,
          {
            extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
          },
        );
      }
    });

    if (members?.AnswerFreeInput[0].dataType !== FieldDataType.Entities)
      throw new GraphQLError(
        `Cannot find field for groupUpdateMetadata request step ${requestStepId}`,
        {
          extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
        },
      );

    const customGroupId = requestStep.Step.FlowVersion.Flow.OwnerGroup?.GroupCustom?.id;

    if (!customGroupId)
      throw new GraphQLError(`Cannot find custom group for request step ${requestStepId}`, {
        extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
      });

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
        entitySetId,
      },
    });

    return true;
  } catch (e) {
    return false;
  }
};
