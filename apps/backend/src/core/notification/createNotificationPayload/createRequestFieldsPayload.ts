import { Field, FieldAnswer, FieldType, WebhookValue } from "@/graphql/generated/resolver-types";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

export const createRequestFieldsPayload = ({
  requestFields,
  requestFieldAnswers,
}: {
  requestFields: Field[];
  requestFieldAnswers: FieldAnswer[];
}): WebhookValue[] => {
  const formattedRequestFields: WebhookValue[] = requestFields.map((field) => {
    const answer = requestFieldAnswers.find((fa) => fa.fieldId === field.fieldId);
    if (!answer)
      return {
        fieldName: field.name,
        value: null,
      };

    switch (answer.__typename) {
      case "FreeInputFieldAnswer":
        return {
          fieldName: field.name,
          value: answer.value,
        };
      case "EntitiesFieldAnswer":
        return {
          fieldName: field.name,
          value: answer.entities.map((e) => e.name).join(", "),
        };
      case "FlowsFieldAnswer":
        return {
          fieldName: field.name,
          value: answer.flows.map((f) => f.name).join(", "),
        };
      case "WebhookFieldAnswer":
        return {
          fieldName: field.name,
          value: answer.uri,
        };
      case "OptionFieldAnswer": {
        if (field.__typename !== FieldType.Options)
          throw new GraphQLError(
            `Options field answer not associated to options field. fieldId: ${field.fieldId}`,
            {
              extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
            },
          );
        return {
          fieldName: field.name,
          optionSelections: answer.selections.map((s) => {
            const option = field.options.find((o) => {
              if (o.optionId === s.optionId) return o.name;
            });
            if (!option) throw Error("");
            return option.name;
          }),
        };
      }
      default:
        throw new GraphQLError(`Unknown field answer type`, {
          extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
        });
    }
  });
  return formattedRequestFields;
};
