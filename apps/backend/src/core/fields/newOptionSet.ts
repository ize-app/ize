import { Prisma, ValueType as PrismaValueType } from "@prisma/client";
import { InputJsonValue } from "@prisma/client/runtime/library";

import { OptionArgs, ValueType } from "@/graphql/generated/resolver-types";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { newValue } from "../value/newValue";
import { validateValue } from "../value/validateValue";

type PrismaOptionArgs = Omit<Prisma.FieldOptionUncheckedCreateInput, "fieldOptionSetId">;

interface OptionSetArgsBase {
  transaction: Prisma.TransactionClient;
}

interface LinkedValueOptionSetArgs extends OptionSetArgsBase {
  type: "linkedValues";
  valueIds: string[];
}

interface NewOptionValuesOptionSetArgs extends OptionSetArgsBase {
  type: "newValues";
  optionsArgs: OptionArgs[];
  valueType?: PrismaValueType | ValueType;
}

type OptionSetArgs = LinkedValueOptionSetArgs | NewOptionValuesOptionSetArgs;

export const newOptionSet = async ({ transaction, ...props }: OptionSetArgs): Promise<string> => {
  let dbOptionsArgs: PrismaOptionArgs[] = [];

  if (props.type === "newValues") {
    const { optionsArgs, valueType } = props;
    dbOptionsArgs = await Promise.all(
      optionsArgs.map(async (optionArgs, index) => {
        if (optionArgs.type === ValueType.OptionSelections) {
          throw new GraphQLError(`Option cannot be an option input type`, {
            extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
          });
        }
        if (valueType) {
          if (optionArgs.type !== valueType) {
            throw new GraphQLError(`Option value type does not match field type: ${valueType}`, {
              extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
            });
          }
        }
        const value = validateValue({
          type: optionArgs.type,
          value: JSON.parse(optionArgs.value) as InputJsonValue,
        });

        const valueId = await newValue({ value, transaction });

        const dbOptionArgs: PrismaOptionArgs = {
          id: optionArgs.optionId,
          index,
          valueId,
        };

        return dbOptionArgs;
      }),
    );
  } else {
    dbOptionsArgs = props.valueIds.map((valueId, index) => ({
      index,
      valueId,
    }));
  }

  const optionSet = await transaction.fieldOptionSet.create({
    data: {
      FieldOptions: { createMany: { data: dbOptionsArgs } },
    },
  });

  return optionSet.id;
};
