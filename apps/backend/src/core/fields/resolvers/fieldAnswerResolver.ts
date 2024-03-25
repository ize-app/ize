import {
  FieldType,
  FieldAnswer,
  OptionFieldAnswer,
  FreeInputFieldAnswer,
  OptionFieldAnswerSelection,
} from "@/graphql/generated/resolver-types";
import { GraphQLError, ApolloServerErrorCode } from "@graphql/errors";
import { FieldAnswerPrismaType } from "../fieldPrismaTypes";

export const fieldAnswerResolver = ({
  fieldAnswer,
}: {
  fieldAnswer: FieldAnswerPrismaType;
}): FieldAnswer => {
  switch (fieldAnswer.type) {
    case FieldType.FreeInput: {
      const freeInputAnswer: FreeInputFieldAnswer = {
        __typename: "FreeInputFieldAnswer",
        fieldId: fieldAnswer.fieldId,
        value: fieldAnswer.AnswerFreeInput[0].value,
      };
      return freeInputAnswer;
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
