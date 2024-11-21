import { FieldPrismaType } from "@/core/fields/fieldPrismaTypes";
import { FieldType } from "@/graphql/generated/resolver-types";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

export const checkRawAnswersConfig = ({
  responseField,
}: {
  responseField: FieldPrismaType;
}): void => {
  if (responseField.type !== FieldType.FreeInput) {
    throw new GraphQLError("Free input field required for raw answers result", {
      extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
    });
  }
};
