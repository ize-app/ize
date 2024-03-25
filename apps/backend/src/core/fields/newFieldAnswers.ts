import { FieldAnswerArgs } from "@/graphql/generated/resolver-types";
import { FieldDataType, FieldType, Prisma } from "@prisma/client";
import { FieldSetPrismaType } from "./fieldPrismaTypes";
import { GraphQLError, ApolloServerErrorCode } from "@graphql/errors";
import { validateInputDataType } from "./validation/validateInputDataType";

// creates field answers to a request or response's fields
// checks that all required fields are presents and that answers are correct type
export const newFieldAnswers = async ({
  fieldSet,
  fieldAnswers,
  transaction,
  responseId,
  requestStepId,
}: {
  fieldSet: FieldSetPrismaType | null;
  fieldAnswers: FieldAnswerArgs[];
  transaction: Prisma.TransactionClient;
  responseId?: string | null | undefined;
  requestStepId?: string | null | undefined;
}): Promise<void> => {
  if (!fieldSet) return;
  if (!responseId && !requestStepId)
    throw new GraphQLError("Missing response Id or requestStepId", {
      extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
    });
  // check whether that all required fields have answers

  const answerFieldIds = fieldAnswers.map((a) => a.fieldId);
  const fields = fieldSet.FieldSetFields.map((f) => f.Field);
  if (fields.some((f) => f.required && !answerFieldIds.includes(f.id)))
    throw new GraphQLError("Missing required fields", {
      extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
    });
  // iterate through each answer
  await Promise.all(
    fieldAnswers.map(async (fieldAnswer) => {
      const field = fields.find((field) => field.id === fieldAnswer.fieldId);
      if (!field)
        throw new GraphQLError(
          `Provided field is not part of field set. fieldId: ${fieldAnswer.fieldId}`,
          {
            extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
          },
        );

      switch (field.type) {
        case FieldType.FreeInput: {
          if (!fieldAnswer.value)
            throw new GraphQLError(
              `Free input field answer is missing value. fieldId: ${fieldAnswer.fieldId}`,
              {
                extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
              },
            );
          if (!validateInputDataType(fieldAnswer.value, field.freeInputDataType as FieldDataType)) {
            throw new GraphQLError(
              `Field answer does not match data type. fieldId: ${fieldAnswer.fieldId}`,
              {
                extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
              },
            );
          }

          await transaction.fieldAnswer.create({
            data: {
              type: FieldType.FreeInput,
              fieldId: field.id,
              requestStepId,
              responseId,
              AnswerFreeInput: {
                create: {
                  dataType: field.freeInputDataType as FieldDataType,
                  value: fieldAnswer.value,
                },
              },
            },
          });

          break;
        }
        //TODO: Make this work for previous step options and request created options
        case FieldType.Options: {
          if (!fieldAnswer.optionSelections)
            throw new GraphQLError(
              `Options field answer is missing options values. fieldId: ${fieldAnswer.fieldId}`,
              {
                extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
              },
            );

          const fieldOptionsConfig = field.FieldOptionsConfigs;

          if (!fieldOptionsConfig)
            throw new GraphQLError(
              `Options field answer is missing options config. fieldId: ${fieldAnswer.fieldId}`,
              {
                extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
              },
            );

          const options = fieldOptionsConfig.FieldOptionSet.FieldOptionSetFieldOptions.map(
            (o) => o.FieldOption,
          );

          if (fieldAnswer.optionSelections.length > fieldOptionsConfig.maxSelections)
            throw new GraphQLError(
              `More option selections submitted than allowable for this field. fieldId: ${fieldAnswer.fieldId}`,
              {
                extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
              },
            );

          // check whether selected options are part of field's option Set
          fieldAnswer.optionSelections.map((optionSelection) => {
            if (!options.some((option) => option.id === optionSelection.optionId))
              throw new GraphQLError(
                `Option selection is not part of option set. fieldId: ${fieldAnswer.fieldId}`,
                {
                  extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
                },
              );
          });

          await transaction.fieldAnswer.create({
            data: {
              type: FieldType.Options,
              fieldId: field.id,
              requestStepId,
              responseId,
              AnswerOptionSelections: {
                createMany: {
                  data: fieldAnswer.optionSelections.map((o) => ({
                    fieldOptionId: o.optionId,
                  })),
                },
              },
            },
          });

          break;
        }
      }
      return;
    }),
  );
};
