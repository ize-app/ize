import { FieldPrismaType } from "@/core/fields/fieldPrismaTypes";
import { ValueType } from "@/graphql/generated/resolver-types";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

export const checkRawAnswersConfig = ({
  responseField,
}: {
  responseField: FieldPrismaType;
}): void => {
  if (responseField.type === ValueType.OptionSelections) {
    throw new GraphQLError("Free input field required for raw answers result", {
      extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
    });
  }
};
