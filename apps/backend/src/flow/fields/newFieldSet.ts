import {
  FieldArgs,
  FieldOptionArgs,
  FieldOptionsConfigArgs,
} from "@/graphql/generated/resolver-types";
import { prisma } from "../../prisma/client";
import { Prisma } from "@prisma/client";

// edit fields
// if an field doesn't change, fieldId shouldn't change
// if an option doesn't change, optionId shouldn't change
// mark whether option should be created new

// if there's a field Id , just use that
// if there's an optionId, just use that
//
export const newFieldSet = async ({
  fields,
  transaction,
}: {
  fields: FieldArgs[];
  transaction: Prisma.TransactionClient;
}): Promise<string | null> => {
  console.log("inside new field set");
  if (fields.length === 0) return null;
  const dbFields = await Promise.all(
    fields.map(async (field) => {
      let optionsConfigId = null;
      if (field.optionsConfig) {
        await createFieldOptionsConfig({
          fieldOptionsConfigArgs: field.optionsConfig,
          transaction,
        });
      }

      const dbField = await transaction.field.create({
        data: {
          name: field.name,
          type: field.type,
          freeInputDataType: field.freeInputDataType,
          fieldOptionsConfigId: optionsConfigId,
          required: field.required,
        },
      });

      return dbField.id;
    }),
  );

  const fieldSet = await transaction.fieldSet.create({
    data: {
      FieldSetFields: { createMany: { data: dbFields.map((fieldId) => ({ fieldId: fieldId })) } },
    },
  });

  return fieldSet.id;
};

// non-destructive. if optionSetId is passed, assume
const createFieldOptionsConfig = async ({
  fieldOptionsConfigArgs,
  transaction = prisma,
}: {
  fieldOptionsConfigArgs: FieldOptionsConfigArgs;
  transaction?: Prisma.TransactionClient;
}): Promise<string> => {
  // if option Configs hasn't changed, just use the existing Id
  const { selectionType, options, hasRequestOptions, maxSelections, requestOptionsDataType } =
    fieldOptionsConfigArgs;

  const dbOptions = await Promise.all(
    options.map(async (option: FieldOptionArgs) => {
      const res = await transaction.fieldOption.create({
        data: {
          value: option.name,
          dataType: option.dataType,
        },
      });
      return { fieldOptionId: res.id };
    }),
  );

  const dbOptionSet = await transaction.fieldOptionsConfig.create({
    data: {
      maxSelections,
      hasRequestOptions,
      requestOptionsDataType,
      selectionType,
      FieldOptionSet: {
        create: {
          FieldOptionSetFieldOptions: {
            createMany: { data: dbOptions },
          },
        },
      },
    },
  });

  return dbOptionSet.id;
};
