import { FieldDataType, FieldType, Prisma } from "@prisma/client";

import { FieldAnswerArgs, FieldOptionsSelectionType } from "@/graphql/generated/resolver-types";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { constructFieldOptions } from "./constructFieldOptions";
import { FieldSetPrismaType } from "./fieldPrismaTypes";
import { validateInput } from "./validation/validateInput";
import { RequestDefinedOptionSetPrismaType } from "../request/requestPrismaTypes";

// creates field answers to a request or response's fields
// checks that all required fields are presents and that answers are correct type
export const newFieldAnswers = async ({
  fieldSet,
  requestDefinedOptionSets,
  fieldAnswers,
  transaction,
  responseId,
  requestStepId,
}: {
  fieldSet: FieldSetPrismaType | null;
  fieldAnswers: FieldAnswerArgs[];
  requestDefinedOptionSets: RequestDefinedOptionSetPrismaType[];
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
  const fieldAnswersFiltered = fieldAnswers.filter(
    (a) =>
      (a.value !== null && a.value !== undefined) ||
      (a.optionSelections && a.optionSelections.length > 0),
  );
  const answerFieldIds = fieldAnswersFiltered.map((a) => a.fieldId);

  const fields = fieldSet.FieldSetFields.map((f) => f.Field).filter((f) => !f.isInternal);

  if (fields.some((f) => f.required && !answerFieldIds.includes(f.id)))
    throw new GraphQLError("Missing required fields", {
      extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
    });
  // iterate through each answer
  await Promise.all(
    fieldAnswersFiltered.map(async (fieldAnswer) => {
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
          // the value should never be empty because we filter out empty values above
          // including this check here to make typescript happy
          if (fieldAnswer.value === null || fieldAnswer.value === undefined)
            throw new GraphQLError(
              `Free input field answer is missing value. fieldId: ${fieldAnswer.fieldId}`,
              {
                extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
              },
            );
          if (!validateInput(fieldAnswer.value, field.freeInputDataType as FieldDataType)) {
            throw new GraphQLError(
              `Field answer does not match data type. fieldDataType: ${
                field.freeInputDataType ?? ""
              } fieldId: ${fieldAnswer.fieldId}`,
              {
                extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
              },
            );
          }

          await transaction.fieldAnswer.create({
            data: {
              type: FieldType.FreeInput,
              fieldId: field.id,
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
        //TODO: Make this work for previous step options (same as request defined options)
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

          const options = constructFieldOptions({ field, requestDefinedOptionSets });

          const totalOptionCount = options.length;

          if (
            fieldOptionsConfig.maxSelections &&
            fieldAnswer.optionSelections.length > fieldOptionsConfig.maxSelections
          )
            throw new GraphQLError(
              `More option selections submitted than allowable for this field. fieldId: ${fieldAnswer.fieldId}`,
              {
                extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
              },
            );

          // check whether selected options are part of field's option Set
          fieldAnswer.optionSelections.map((optionSelectionArgs) => {
            if (
              !options.some((option) => {
                if (optionSelectionArgs.optionId) return option.id === optionSelectionArgs.optionId;
                else if (typeof optionSelectionArgs.optionIndex === "number")
                  return option.id === options[optionSelectionArgs.optionIndex].id;
                return false;
              })
            )
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
              responseId,
              AnswerOptionSelections: {
                createMany: {
                  data: fieldAnswer.optionSelections.map((optionSelectionArgs, index) => {
                    let fieldOptionId: string;
                    if (optionSelectionArgs.optionId) {
                      fieldOptionId = optionSelectionArgs.optionId;
                    } else if (typeof optionSelectionArgs.optionIndex === "number") {
                      fieldOptionId = options[optionSelectionArgs.optionIndex].id;
                    } else {
                      throw new GraphQLError(`Missing  option selection for field: ${field.id}`, {
                        extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
                      });
                    }
                    return {
                      fieldOptionId,
                      weight:
                        field.FieldOptionsConfigs?.selectionType === FieldOptionsSelectionType.Rank
                          ? totalOptionCount - index
                          : 1,
                    };
                  }),
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
