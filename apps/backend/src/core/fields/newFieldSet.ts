import { Prisma } from "@prisma/client";

import { FieldArgs, FieldOptionsConfigArgs } from "@/graphql/generated/resolver-types";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { FieldSetPrismaType, fieldSetInclude } from "./fieldPrismaTypes";
import { newOptionSet } from "./newOptionSet";
import { prisma } from "../../prisma/client";
import { StepPrismaType } from "../flow/flowPrismaTypes";

export const newFieldSet = async ({
  fields,
  createdSteps,
  transaction,
}: {
  fields: FieldArgs[];
  createdSteps: StepPrismaType[];
  transaction: Prisma.TransactionClient;
}): Promise<FieldSetPrismaType | null> => {
  if (fields.length === 0) return null;
  const dbFields = await Promise.all(
    fields.map(async (field) => {
      let fieldOptionsConfigId: string | null = null;
      if (field.optionsConfig) {
        fieldOptionsConfigId = await createFieldOptionsConfig({
          fieldOptionsConfigArgs: field.optionsConfig,
          createdSteps,
          transaction,
        });
      }

      const dbField = await transaction.field.create({
        data: {
          name: field.name,
          type: field.type,
          freeInputDataType: field.freeInputDataType,
          fieldOptionsConfigId,
          required: field.required,
        },
      });

      return dbField.id;
    }),
  );

  const fieldSet = await transaction.fieldSet.create({
    include: fieldSetInclude,
    data: {
      FieldSetFields: { createMany: { data: dbFields.map((fieldId) => ({ fieldId: fieldId })) } },
    },
  });

  return fieldSet;
};

const createFieldOptionsConfig = async ({
  fieldOptionsConfigArgs,
  createdSteps,
  transaction = prisma,
}: {
  fieldOptionsConfigArgs: FieldOptionsConfigArgs;
  createdSteps: StepPrismaType[];
  transaction?: Prisma.TransactionClient;
}): Promise<string> => {
  // if option Configs hasn't changed, just use the existing Id
  const {
    selectionType,
    options,
    hasRequestOptions,
    maxSelections,
    requestOptionsDataType,
    linkedResultOptions,
  } = fieldOptionsConfigArgs;

  const optionSetId = await newOptionSet({ options, transaction });
  const dbOptionSet = await transaction.fieldOptionsConfig.create({
    data: {
      maxSelections:
        selectionType === "MultiSelect" ? maxSelections : selectionType === "Select" ? 1 : null,
      hasRequestOptions,
      requestOptionsDataType,
      selectionType,
      linkedResultOptions: linkedResultOptions.map((l) => {
        const resultConfigId =
          createdSteps[l.stepIndex].ResultConfigSet?.ResultConfigSetResultConfigs[l.resultIndex]
            .resultConfigId;
        if (!resultConfigId)
          throw new GraphQLError(`Cannot find result config`, {
            extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
          });
        return resultConfigId;
      }),
      FieldOptionSet: optionSetId
        ? {
            connect: {
              id: optionSetId,
            },
          }
        : {},
    },
  });

  return dbOptionSet.id;
};
