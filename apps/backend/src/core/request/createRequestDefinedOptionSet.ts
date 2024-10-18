import { Prisma } from "@prisma/client";

import { FieldOptionArgs } from "@/graphql/generated/resolver-types";
import { prisma } from "@/prisma/client";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { requestDefinedOptionSetInclude } from "./requestPrismaTypes";
import { newOptionSet } from "../fields/newOptionSet";
import { StepPrismaType } from "../flow/flowPrismaTypes";

// creates dynamic additional options to be appended to field's predefined options
export const createRequestDefinedOptionSet = async ({
  step,
  requestStepId,
  fieldId,
  newOptionArgs,
  isTriggerDefinedOptions,
  transaction = prisma,
}: {
  step: StepPrismaType;
  requestStepId: string;
  fieldId: string;
  isTriggerDefinedOptions: boolean;
  newOptionArgs: FieldOptionArgs[];

  transaction?: Prisma.TransactionClient;
}) => {
  if (!step.FieldSet)
    throw new GraphQLError(
      "Request defined options provided, but this flow step does not have response fields.",
      {
        extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
      },
    );

  const field = step.FieldSet.FieldSetFields.find((f) => f.fieldId === fieldId);
  if (!field)
    throw new GraphQLError("Cannot find flow field corresponding to request defined options.", {
      extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
    });

  if (isTriggerDefinedOptions && !field.Field.FieldOptionsConfigs?.requestOptionsDataType)
    throw new GraphQLError(
      "Request defined options provided but this field does not allow request defined options.",
      {
        extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
      },
    );

  const optionSetId = await newOptionSet({
    transaction,
    options: newOptionArgs,
    dataType: isTriggerDefinedOptions
      ? field.Field.FieldOptionsConfigs?.requestOptionsDataType ?? undefined
      : undefined,
  });

  return await transaction.requestDefinedOptionSet.create({
    include: requestDefinedOptionSetInclude,
    data: {
      RequestStep: {
        connect: {
          id: requestStepId,
        },
      },
      Field: {
        connect: {
          id: fieldId,
        },
      },
      FieldOptionSet: {
        connect: {
          id: optionSetId,
        },
      },
    },
  });
};
