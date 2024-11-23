import { Prisma } from "@prisma/client";

import {
  FieldOptionsConfigArgs,
  FieldSetArgs,
  OptionSelectionType,
} from "@/graphql/generated/resolver-types";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { FieldSetPrismaType, fieldSetInclude } from "./fieldPrismaTypes";
import { newOptionSet } from "./newOptionSet";
import { prisma } from "../../prisma/client";
import { StepPrismaType } from "../flow/flowPrismaTypes";

type PrismaFieldArgs = Omit<Prisma.FieldUncheckedCreateInput, "fieldSetId">;

export const newFieldSet = async ({
  fieldSetArgs,
  createdSteps,
  transaction,
}: {
  fieldSetArgs: FieldSetArgs;
  createdSteps: StepPrismaType[];
  transaction: Prisma.TransactionClient;
}): Promise<FieldSetPrismaType | null> => {
  const { fields, locked } = fieldSetArgs;
  if (fields.length === 0) return null;
  const dbFieldsArgs: PrismaFieldArgs[] = await Promise.all(
    fields.map(async (field, fieldIndex) => {
      let fieldOptionsConfigId: string | null = null;
      if (field.optionsConfig) {
        fieldOptionsConfigId = await createFieldOptionsConfig({
          fieldOptionsConfigArgs: field.optionsConfig,
          createdSteps,
          transaction,
        });
      }

      const fieldArgs: PrismaFieldArgs = {
        id: field.fieldId,
        index: fieldIndex,
        name: field.name,
        type: field.type,
        systemType: field.systemType,
        freeInputDataType: field.freeInputDataType,
        isInternal: field.isInternal,
        fieldOptionsConfigId,
        required: field.required,
      };

      return fieldArgs;
    }),
  );

  const fieldSet = await transaction.fieldSet.create({
    include: fieldSetInclude,
    data: {
      locked,
      Fields: {
        createMany: {
          data: dbFieldsArgs,
        },
      },
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
  const { selectionType, options, maxSelections, requestOptionsDataType, linkedResultOptions } =
    fieldOptionsConfigArgs;

  const optionSetId = await newOptionSet({ optionsArgs: options, transaction });
  const optionsConfig = await transaction.fieldOptionsConfig.create({
    data: {
      maxSelections:
        selectionType === OptionSelectionType.MultiSelect
          ? maxSelections
          : selectionType === OptionSelectionType.Select
            ? 1
            : null,
      requestOptionsDataType,
      selectionType,
      linkedResultOptions: linkedResultOptions.map((linkedResultConfigId) => {
        let hasLinkedResult = false;

        for (const step of createdSteps) {
          const foundMatch = step.ResultConfigSet?.ResultConfigs.find(
            (rc) => rc.id === linkedResultConfigId,
          );
          if (foundMatch) {
            hasLinkedResult = true;
            break;
          }
        }
        if (!hasLinkedResult)
          throw new GraphQLError(`Cannot find result config`, {
            extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
          });
        return linkedResultConfigId;
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

  return optionsConfig.id;
};
