import { Prisma, Value } from "@prisma/client";

import { ValueType } from "@/graphql/generated/resolver-types";

import { ValueSchemaType } from "./valueSchema";

export const newValue = async ({
  value,
  transaction,
}: {
  transaction: Prisma.TransactionClient;
  value: ValueSchemaType;
}): Promise<string> => {
  //   const val = validateValue({ type, value });
  let dbValue: Value;

  switch (value.type) {
    case ValueType.String: {
      dbValue = await transaction.value.create({
        data: {
          type: value.type,
          string: value.value,
        },
      });
      break;
    }
    case ValueType.Uri: {
      dbValue = await transaction.value.create({
        data: {
          type: value.type,
          json: value.value,
        },
      });
      break;
    }
    case ValueType.Float: {
      dbValue = await transaction.value.create({
        data: {
          type: value.type,
          float: value.value,
        },
      });
      break;
    }
    case ValueType.Date: {
      dbValue = await transaction.value.create({
        data: {
          type: value.type,
          date: value.value,
        },
      });
      break;
    }
    case ValueType.DateTime: {
      dbValue = await transaction.value.create({
        data: {
          type: value.type,
          dateTime: value.value,
        },
      });
      break;
    }
    case ValueType.FlowVersion: {
      dbValue = await transaction.value.create({
        data: {
          type: value.type,
          flowVersionId: value.value,
        },
      });
      break;
    }
    case ValueType.Entities: {
      dbValue = await transaction.value.create({
        data: {
          type: value.type,
          ValueEntities: {
            createMany: {
              data: [...value.value.map((entityId) => ({ entityId }))],
            },
          },
        },
      });
      break;
    }
    case ValueType.Flows: {
      dbValue = await transaction.value.create({
        data: {
          type: value.type,
          ValueFlows: {
            createMany: {
              data: [...value.value.map((flowId) => ({ flowId }))],
            },
          },
        },
      });
      break;
    }
    case ValueType.OptionSelections: {
      dbValue = await transaction.value.create({
        data: {
          type: value.type,
          ValueOptionSelections: {
            createMany: {
              data: [
                ...value.value.map((selection) => ({
                  optionId: selection.optionId,
                  weight: selection.weight,
                })),
              ],
            },
          },
        },
      });
      break;
    }
  }

  return dbValue.id;
};
