import { FieldOptionArgs } from "@/graphql/generated/resolver-types";
import { FieldDataType, Prisma } from "@prisma/client";
import { validateInputDataType } from "./validation/validateInputDataType";
import { GraphQLError, ApolloServerErrorCode } from "@graphql/errors";

export const newOptionSet = async ({
  options,
  // dataType is only used if you want to enforce a single data type for the entire option set
  dataType,
  transaction,
}: {
  options: FieldOptionArgs[];
  dataType?: FieldDataType;
  transaction: Prisma.TransactionClient;
}): Promise<string> => {
  const fieldOptions = await Promise.all(
    options.map(async (option: FieldOptionArgs, index) => {
      if (dataType && dataType !== option.dataType)
        throw new GraphQLError(
          `Option does not march required data type for field set: ${option.dataType}`,
          {
            extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
          },
        );
      if (!validateInputDataType(option.name, option.dataType))
        throw new GraphQLError(`Option value does not match field type: ${option.dataType}`, {
          extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
        });
      const res = await transaction.fieldOption.create({
        data: {
          name: option.name,
          dataType: option.dataType,
        },
      });
      return { fieldOptionId: res.id, index };
    }),
  );

  const optionSet = await transaction.fieldOptionSet.create({
    data: {
      FieldOptionSetFieldOptions: {
        createMany: { data: fieldOptions },
      },
    },
  });

  return optionSet.id;
};
