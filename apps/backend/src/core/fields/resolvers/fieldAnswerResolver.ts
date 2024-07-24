import { entityInclude } from "@/core/entity/entityPrismaTypes";
import { entityResolver } from "@/core/entity/entityResolver";
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
}: {
  fieldAnswer: FieldAnswerPrismaType;
  userIdentityIds?: string[];
}): Promise<FieldAnswer> => {
  switch (fieldAnswer.type) {
    case FieldType.FreeInput: {
      if (fieldAnswer.AnswerFreeInput[0].dataType === FieldDataType.Entities) {
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
