import { Prisma, ValueType } from "@prisma/client";

import { OptionArgs } from "@/graphql/generated/resolver-types";

import { requestDefinedOptionSetInclude } from "./requestPrismaTypes";
import { newOptionSet } from "../fields/newOptionSet";

interface RequestDefinedOptionsArgsBase {
  requestId: string;
  fieldId: string;
  transaction: Prisma.TransactionClient;
}

interface TriggerRequestDefinedOptionsArgs extends RequestDefinedOptionsArgsBase {
  type: "trigger";
  valueType: ValueType;
  newOptionArgs: OptionArgs[];
}

interface ResultRequestDefinedOptionsArgs extends RequestDefinedOptionsArgsBase {
  type: "result";
  valueIds: string[];
}

type RequestDefinedOptionsArgs = TriggerRequestDefinedOptionsArgs | ResultRequestDefinedOptionsArgs;

// creates dynamic additional options to be appended to field's predefined options
export const createRequestDefinedOptionSet = async ({
  requestId,
  fieldId,
  transaction,
  ...props
}: RequestDefinedOptionsArgs) => {
  let optionSetId: string | undefined = undefined;

  if (props.type === "trigger") {
    const valueType: ValueType = props.valueType;

    optionSetId = await newOptionSet({
      type: "newValues",
      transaction,
      optionsArgs: props.newOptionArgs,
      valueType,
    });
  } else {
    optionSetId = await newOptionSet({
      type: "linkedValues",
      transaction,
      valueIds: props.valueIds,
    });
  }

  return await transaction.requestDefinedOptionSet.create({
    include: requestDefinedOptionSetInclude,
    data: {
      isTriggerDefined: props.type === "trigger",
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
