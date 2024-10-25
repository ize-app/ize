import { FieldType, GenericFieldAndValue, Request } from "@/graphql/generated/resolver-types";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

export const getRequestTriggerFieldAnswers = ({
  request,
}: {
  request: Request;
}): GenericFieldAndValue[] => {
  const requestFields: GenericFieldAndValue[] = request.flow.fieldSet.fields.map((field) => {
    const triggerFieldAnswer = request.triggerFieldAnswers.find(
      (fa) => fa.field.fieldId === field.fieldId,
    );
    const answer = triggerFieldAnswer?.answer.answer;

    if (!answer) throw Error("");

    let value: string[] = [];

    switch (answer.__typename) {
      case "FreeInputFieldAnswer":
        value = [answer.value];
        break;
      case "EntitiesFieldAnswer":
        value = answer.entities.map((e) => e.name);
        break;
      case "FlowsFieldAnswer":
        value = answer.flows.map((f) => f.flowName);
        break;
      case "WebhookFieldAnswer":
        value = [answer.uri];
        break;
      case "OptionFieldAnswer": {
        if (field.__typename !== FieldType.Options)
          throw new GraphQLError(
            `Options field answer not associated to options field. fieldId: ${field.fieldId}`,
            {
              extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
            },
          );
        value = answer.selections.map((s) => {
          const option = field.options.find((o) => {
            if (o.optionId === s.optionId) return o.name;
          });
          if (!option) throw Error("");
          return option.name;
        });
        break;
      }
      default:
        throw new GraphQLError(`Unknown field answer type`, {
          extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
        });
    }

    return {
      fieldName: field.name,
      value,
    };
  });

  return requestFields;
};
