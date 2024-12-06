import { Prisma } from "@prisma/client";

import {
  FieldOptionsConfigArgs,
  FieldSetArgs,
  OptionSelectionType,
  ValueType,
} from "@/graphql/generated/resolver-types";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { FieldSetPrismaType, fieldSetInclude } from "./fieldPrismaTypes";
import { newOptionSet } from "./newOptionSet";
import { prisma } from "../../prisma/client";
import { StepPrismaType } from "../flow/flowPrismaTypes";

interface FieldSetArgsBase {
  fieldSetArgs: FieldSetArgs;
  createdSteps: StepPrismaType[];
  transaction: Prisma.TransactionClient;
}

interface TriggerFieldSetArgs extends FieldSetArgsBase {
  type: "trigger";
  flowVersionId: string;
}

interface ResponseFieldSetArgs extends FieldSetArgsBase {
  type: "response";
  stepId: string;
}

type NewFieldSet = TriggerFieldSetArgs | ResponseFieldSetArgs;

export const newFieldSet = async ({
  fieldSetArgs,
  createdSteps,
  transaction,
  ...props
}: NewFieldSet): Promise<FieldSetPrismaType | null> => {
  const { fields, locked } = fieldSetArgs;
  let flowVersionId: string | undefined = undefined;
  let stepId: string | undefined = undefined;

  if (props.type === "trigger") flowVersionId = props.flowVersionId;
  else if (props.type === "response") stepId = props.stepId;

  if (fields.length === 0) return null;

  const fieldSet = await transaction.fieldSet.create({
    data: {
      flowVersionId,
      stepId,
      locked,
    },
  });

  await Promise.all(
    fields.map(async (f, fieldIndex) => {
      const field = await transaction.field.create({
        data: {
          fieldSetId: fieldSet.id,
          id: f.fieldId,
          index: fieldIndex,
          name: f.name,
          type: f.type,
          systemType: f.systemType,
          isInternal: f.isInternal,
          required: f.required,
        },
      });

      if (f.type === ValueType.OptionSelections) {
        if (!f.optionsConfig)
          throw new GraphQLError(`Options field is missing options args`, {
            extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
          });
        await createFieldOptionsConfig({
          fieldId: field.id,
          fieldOptionsConfigArgs: f.optionsConfig,
          createdSteps,
          transaction,
        });
      }

      return;
    }),
  );

  return await transaction.fieldSet.findUniqueOrThrow({
    where: { id: fieldSet.id },
    include: fieldSetInclude,
  });
};

const createFieldOptionsConfig = async ({
  fieldId,
  fieldOptionsConfigArgs,
  createdSteps,
  transaction = prisma,
}: {
  fieldId: string;
  fieldOptionsConfigArgs: FieldOptionsConfigArgs;
  createdSteps: StepPrismaType[];
  transaction?: Prisma.TransactionClient;
}): Promise<string> => {
  // if option Configs hasn't changed, just use the existing Id
  const { selectionType, options, maxSelections, triggerOptionsType, linkedResultOptions } =
    fieldOptionsConfigArgs;

  linkedResultOptions.map((linkedResultConfigId) => {
    // validating that resultConfigId exists in the flow
    let hasLinkedResult = false;
    for (const step of createdSteps) {
      const foundMatch = (step.ResultConfigSet?.ResultConfigs ?? []).find((rc) => {
        return rc.id === linkedResultConfigId;
      });
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
  });

  const optionSetId = await newOptionSet({ type: "newValues", optionsArgs: options, transaction });
  const optionsConfig = await transaction.fieldOptionsConfig.create({
    data: {
      fieldId,
      maxSelections: selectionType === OptionSelectionType.Rank ? null : maxSelections,
      triggerOptionsType,
      selectionType,
      FieldOptionsConfigLinkedResults: {
        createMany: {
          data: linkedResultOptions.map((linkedResultConfigId) => {
            return {
              resultConfigId: linkedResultConfigId,
            };
          }),
        },
      },
      fieldOptionSetId: optionSetId,
    },
  });

  return optionsConfig.id;
};
