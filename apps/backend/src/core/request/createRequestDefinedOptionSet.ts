import { Prisma } from "@prisma/client";

import { FieldOptionArgs } from "@/graphql/generated/resolver-types";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { requestDefinedOptionSetInclude } from "./requestPrismaTypes";
import { FieldPrismaType } from "../fields/fieldPrismaTypes";
import { newOptionSet } from "../fields/newOptionSet";
import { FlowVersionPrismaType } from "../flow/flowPrismaTypes";

// creates dynamic additional options to be appended to field's predefined options
export const createRequestDefinedOptionSet = async ({
  flowVersion,
  requestId,
  fieldId,
  newOptionArgs,
  isTriggerDefinedOptions,
  transaction,
}: {
  flowVersion: FlowVersionPrismaType;
  requestId: string;
  fieldId: string;
  isTriggerDefinedOptions: boolean;
  newOptionArgs: FieldOptionArgs[];

  transaction: Prisma.TransactionClient;
}) => {
  let field: FieldPrismaType | null = null;
  for (const step of flowVersion.Steps ?? []) {
    const f = (step.FieldSet?.FieldSetFields ?? []).find((f) => f.fieldId === fieldId);
    if (f) {
      field = f.Field;
      break;
    }
  }

  if (!field) {
    throw new GraphQLError("Cannot find flow field corresponding to request defined options.", {
      extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
    });
  }

  if (isTriggerDefinedOptions && !field.FieldOptionsConfigs?.requestOptionsDataType) {
    throw new GraphQLError(
      "Request defined options provided but this field does not allow request defined options.",
      {
        extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
      },
    );
  }

  const optionSetId = await newOptionSet({
    transaction,
    optionsArgs: newOptionArgs,
    dataType: isTriggerDefinedOptions
      ? field.FieldOptionsConfigs?.requestOptionsDataType ?? undefined
      : undefined,
  });

  return await transaction.requestDefinedOptionSet.create({
    include: requestDefinedOptionSetInclude,
    data: {
      Request: {
        connect: {
          id: requestId,
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
