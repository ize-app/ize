import { FieldType, GenericFieldAndValue, Request } from "@/graphql/generated/resolver-types";
import { GraphQLError, ApolloServerErrorCode } from "@graphql/errors";

export const getRequestTriggerFieldAnswers = ({
  request,
}: {
  request: Request;
}): GenericFieldAndValue[] => {
  const requestFields: GenericFieldAndValue[] = request.flow.steps[0].request.fields.map(
    (field) => {
      const answer = request.steps[0].requestFieldAnswers.find(
        (fa) => fa.fieldId === field.fieldId,
      );
      if (!answer) throw Error("");
      if (field.__typename === FieldType.FreeInput) {
        if (answer.__typename !== "FreeInputFieldAnswer")
          throw new GraphQLError(
            `Free input field ${field.fieldId} has field answer that is not free input answer`,
            {
              extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
            },
          );
        return {
          fieldName: field.name,
          value: [answer.value],
        };
      } else if (field.__typename === FieldType.Options) {
        if (answer.__typename !== "OptionFieldAnswer")
          throw new GraphQLError(
            `Options field ${field.fieldId} has field answer that is not options answer`,
            {
              extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
            },
          );
        return {
          fieldName: field.name,
          value: answer.selections.map((s) => {
            const option = field.options.find((o) => {
              if (o.optionId === s.optionId) return o.name;
            });
            if (!option) throw Error("");
            return option.name;
          }),
        };
      } else
        throw new GraphQLError(`Unknown field type. field ID: ${field.fieldId}`, {
          extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
        });
    },
  );

  return requestFields;
};
