import { entityInclude } from "@/core/entity/entityPrismaTypes";
import { entityResolver } from "@/core/entity/entityResolver";
import { createFlowSummaryInclude } from "@/core/flow/flowPrismaTypes";
import { flowSummaryResolver } from "@/core/flow/resolvers/flowSummaryResolver";
import {
  EntitiesFieldAnswer,
  FieldAnswer,
  FieldDataType,
  FieldType,
  FreeInputFieldAnswer,
  OptionFieldAnswer,
  OptionFieldAnswerSelection,
} from "@/graphql/generated/resolver-types";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { prisma } from "../../../prisma/client";
import { FieldAnswerPrismaType } from "../fieldPrismaTypes";

export const fieldAnswerResolver = async ({
  fieldAnswer,
  userIdentityIds,
  userId,
}: {
  fieldAnswer: FieldAnswerPrismaType;
  userIdentityIds?: string[];
  userId: string | undefined;
}): Promise<FieldAnswer> => {
  switch (fieldAnswer.type) {
    case FieldType.FreeInput: {
      if (fieldAnswer.AnswerFreeInput[0].dataType === FieldDataType.EntityIds) {
        const entityIds = JSON.parse(fieldAnswer.AnswerFreeInput[0].value) as string[];
        const entities = await prisma.entity.findMany({
          include: entityInclude,
          where: { id: { in: entityIds } },
        });

        const entityAnswer: EntitiesFieldAnswer = {
          __typename: "EntitiesFieldAnswer",
          fieldId: fieldAnswer.fieldId,
          entities: entities.map((entity) => entityResolver({ entity, userIdentityIds })),
        };
        return entityAnswer;
      } else if (fieldAnswer.AnswerFreeInput[0].dataType === FieldDataType.FlowIds) {
        const flowIds = JSON.parse(fieldAnswer.AnswerFreeInput[0].value) as string[];
        const flows = await prisma.flow.findMany({
          include: createFlowSummaryInclude(userId),
          where: { id: { in: flowIds } },
        });
        return {
          __typename: "FlowsFieldAnswer",
          fieldId: fieldAnswer.fieldId,
          flows: flows.map((flow) =>
            flowSummaryResolver({
              flow,
              identityIds: userIdentityIds ?? [],
              groupIds: [], // TODO pass this in properly
              userId: "", // TODO pass this in properly
            }),
          ),
        };
      } else {
        const freeInputAnswer: FreeInputFieldAnswer = {
          __typename: "FreeInputFieldAnswer",
          fieldId: fieldAnswer.fieldId,
          value: fieldAnswer.AnswerFreeInput[0].value,
        };
        return freeInputAnswer;
      }
    }
    case FieldType.Options: {
      const optionsAnswer: OptionFieldAnswer = {
        __typename: "OptionFieldAnswer",
        fieldId: fieldAnswer.fieldId,
        selections: fieldAnswer.AnswerOptionSelections.map(
          (s): OptionFieldAnswerSelection => ({
            optionId: s.fieldOptionId,
          }),
        ),
      };
      return optionsAnswer;
    }
    default:
      throw new GraphQLError("Unknown field type", {
        extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
      });
  }
};
