import { FieldDataType, Prisma } from "@prisma/client";

import { FieldOptionArgs } from "@/graphql/generated/resolver-types";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { validateInput } from "./validation/validateInput";

type PrismaOptionArgs = Omit<Prisma.FieldOptionUncheckedCreateInput, "fieldOptionSetId">;

export const newOptionSet = async ({
  optionsArgs,
  // dataType is only used if you want to enforce a single data type for the entire option set
  dataType,
  transaction,
}: {
  optionsArgs: FieldOptionArgs[];
  dataType?: FieldDataType;
  transaction: Prisma.TransactionClient;
}): Promise<string > => {
  const dbOptionsArgs: PrismaOptionArgs[] = optionsArgs.map(
    (optionArgs: FieldOptionArgs, index) => {
      if (dataType && dataType !== optionArgs.dataType) {
        throw new GraphQLError(
          `Option does not march required data type for field set: ${optionArgs.dataType}`,
          {
            extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
          },
        );
      }
      if (!validateInput(optionArgs.name, optionArgs.dataType)) {
        throw new GraphQLError(`Option value does not match field type: ${optionArgs.dataType}`, {
          extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
        });
      }

      const dbOptionArgs: PrismaOptionArgs = {
        id: optionArgs.optionId,
        index,
        name: optionArgs.name,
        dataType: optionArgs.dataType,
      };

      return dbOptionArgs;
    },
  );

  const optionSet = await transaction.fieldOptionSet.create({
    data: {
      FieldOptions: { createMany: { data: dbOptionsArgs } },
    },
  });

  return optionSet.id;
};
