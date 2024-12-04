import { ValueType as PrismaValueType } from "@prisma/client";
import { InputJsonValue } from "@prisma/client/runtime/library";

import { ValueType } from "@/graphql/generated/resolver-types";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { ValueSchemaType, valueSchema } from "./valueSchema";

export const validateValue = ({
  value,
  type,
}: {
  value: InputJsonValue;
  type: ValueType | PrismaValueType;
}): ValueSchemaType => {
  try {
    return valueSchema.parse({
      type,
      //eslint-disable-next-line
      value: value,
    });
  } catch (error) {
    console.log("Input validation error: ", error);
    throw new GraphQLError(`Option value does not match field type: ${type}`, {
      extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
    });
  }
};
