import { FieldArgs, FieldOptionsConfigArgs } from "@/graphql/generated/resolver-types";
import { prisma } from "../../prisma/client";
import { Prisma } from "@prisma/client";
import { FieldSetPrismaType, fieldSetInclude } from "./fieldPrismaTypes";
import { newOptionSet } from "./newOptionSet";

export const newFieldSet = async ({
  fields,
  transaction,
}: {
  fields: FieldArgs[];
  transaction: Prisma.TransactionClient;
}): Promise<FieldSetPrismaType | null> => {
  if (fields.length === 0) return null;
  const dbFields = await Promise.all(
    fields.map(async (field) => {
      let fieldOptionsConfigId: string | null = null;
      if (field.optionsConfig) {
        fieldOptionsConfigId = await createFieldOptionsConfig({
          fieldOptionsConfigArgs: field.optionsConfig,
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
  transaction = prisma,
}: {
  fieldOptionsConfigArgs: FieldOptionsConfigArgs;
  transaction?: Prisma.TransactionClient;
}): Promise<string> => {
  // if option Configs hasn't changed, just use the existing Id
  const {
    selectionType,
    options,
    hasRequestOptions,
    maxSelections,
    requestOptionsDataType,
    linkedOptions,
  } = fieldOptionsConfigArgs;

  const optionSetId = await newOptionSet({ options, transaction });
  const dbOptionSet = await transaction.fieldOptionsConfig.create({
    data: {
      maxSelections,
      hasRequestOptions,
      requestOptionsDataType,
      selectionType,
      linkedResultOptions: linkedOptions.map((l) => l.id),
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
