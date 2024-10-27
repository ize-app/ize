import { Prisma } from "@prisma/client";

import { FieldOptionArgs } from "@/graphql/generated/resolver-types";
import { prisma } from "@/prisma/client";
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
  transaction = prisma,
}: {
  flowVersion: FlowVersionPrismaType;
  requestId: string;
  fieldId: string;
  isTriggerDefinedOptions: boolean;
  newOptionArgs: FieldOptionArgs[];

  transaction?: Prisma.TransactionClient;
}) => {
  let field: FieldPrismaType | null = null;
  console.log("creating request defined option set", fieldId, newOptionArgs);
  for (const step of flowVersion.Steps ?? []) {
    const f = (step.FieldSet?.FieldSetFields ?? []).find((f) => f.fieldId === fieldId);
    if (f) {
      field = f.Field;
      break;
    }
  }

  console.log("field is ", field);

  if (!field)
    throw new GraphQLError("Cannot find flow field corresponding to request defined options.", {
      extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
    });

  if (isTriggerDefinedOptions && !field.FieldOptionsConfigs?.requestOptionsDataType)
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
