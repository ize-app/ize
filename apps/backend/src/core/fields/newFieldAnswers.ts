import { Prisma } from "@prisma/client";
import { InputJsonValue } from "@prisma/client/runtime/library";

import { FieldAnswerArgs, ValueType } from "@/graphql/generated/resolver-types";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { constructOrderedOptions } from "./constructOrderedOptions";
import { FieldSetPrismaType } from "./fieldPrismaTypes";
import { RequestDefinedOptionSetPrismaType } from "../request/requestPrismaTypes";
import { validateValue } from "../value/validateValue";
import { validateOptionSelections } from "./validation/validateOptionSelections";
import { newValue } from "../value/newValue";
import { getOptionArgsWithOptionId } from "./validation/getOptionArgsWithOptionId";
import { ValueSchemaType } from "../value/valueSchema";

interface FieldAnswersBase {
  transaction: Prisma.TransactionClient;
  fieldSet: FieldSetPrismaType;
  fieldAnswers: FieldAnswerArgs[];
}

interface RequestFieldAnswerPermission extends FieldAnswersBase {
  type: "request";
  requestId: string;
}

interface ResponseFieldAnswerPermission extends FieldAnswersBase {
  type: "response";
  responseId: string;
  requestDefinedOptionSets: RequestDefinedOptionSetPrismaType[];
}

type NewFieldAnswers = RequestFieldAnswerPermission | ResponseFieldAnswerPermission;

// creates field answers to a request or response's fields
// checks that all required fields are presents and that answers are correct type
export const newFieldAnswers = async ({
  fieldSet,
  transaction,
  fieldAnswers,
  ...props
}: NewFieldAnswers): Promise<void> => {
  if (!fieldSet) return;
  let responseId: string | undefined = undefined;
  let requestId: string | undefined = undefined;
  let requestDefinedOptionSets: RequestDefinedOptionSetPrismaType[] = [];

  switch (props.type) {
    case "request": {
      requestId = props.requestId;
      break;
    }
    case "response": {
      responseId = props.responseId;
      requestDefinedOptionSets = props.requestDefinedOptionSets;
      break;
    }
  }

  if (!responseId && !requestId)
    throw new GraphQLError("Missing response Id or requestStepId", {
      extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
    });

  const answerFieldIds = fieldAnswers.map((a) => a.fieldId);

  const fields = fieldSet.Fields.filter((f) => !f.isInternal);

  if (fields.some((f) => f.required && !answerFieldIds.includes(f.id)))
    throw new GraphQLError("Missing required fields", {
      extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
    });
  // iterate through each answer
  await Promise.all(
    fieldAnswers.map(async (fieldAnswer) => {
      let validatedValue: ValueSchemaType;
      const field = fields.find((field) => field.id === fieldAnswer.fieldId);
      if (!field)
        throw new GraphQLError(
          `Provided field is not part of field set. fieldId: ${fieldAnswer.fieldId}`,
          {
            extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
          },
        );

      if (field.type === ValueType.OptionSelections) {
        const optionsConfig = field.FieldOptionsConfig;
        const optionSelections = fieldAnswer.optionSelections;
        if (!optionSelections)
          throw new GraphQLError(
            `No field answer options selections provided for fieldId: ${fieldAnswer.fieldId}`,
            {
              extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
            },
          );

        if (!optionsConfig)
          throw new GraphQLError(
            `Options field is missing options config: ${fieldAnswer.fieldId}`,
            {
              extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
            },
          );
          
        const availableOptionIds = constructOrderedOptions({
          optionsConfig,
          requestDefinedOptionSets,
        }).map((option) => option.id);

        const optionArgsWithOptionId = getOptionArgsWithOptionId({
          optionSelections,
          availableOptionIds,
          fieldId: fieldAnswer.fieldId,
        });

        // maybe move this validation logic inside validateOptionSelections
        validateOptionSelections({
          selections: optionArgsWithOptionId,
          optionsConfig,
          availableOptionIds,
          fieldId: fieldAnswer.fieldId,
        });

        validatedValue = validateValue({
          type: field.type as ValueType,
          value: optionArgsWithOptionId,
        });
      } else {
        if (!fieldAnswer.value)
          throw new GraphQLError(
            `No field answer value provided for fieldId: ${fieldAnswer.fieldId}`,
            {
              extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
            },
          );

        validatedValue = validateValue({
          type: field.type as ValueType,
          value: JSON.parse(fieldAnswer.value) as InputJsonValue,
        });
      }
      const valueId = await newValue({ value: validatedValue, transaction });

      await transaction.fieldAnswer.create({
        data: {
          fieldId: field.id,
          responseId,
          requestId,
          valueId,
        },
      });

      return;
    }),
  );
};
