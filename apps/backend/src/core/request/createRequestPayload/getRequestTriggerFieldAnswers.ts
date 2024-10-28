import { FieldType, GenericFieldAndValue, Request } from "@/graphql/generated/resolver-types";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

export const getRequestTriggerFieldAnswers = ({
  request,
}: {
  request: Request;
}): GenericFieldAndValue[] => {
  const requestFields: GenericFieldAndValue[] = [];
  request.flow.fieldSet.fields.forEach((field) => {
    const triggerFieldAnswer = request.triggerFieldAnswers.find(
      (fa) => fa.field.fieldId === field.fieldId,
    );
    const rawAnswer = triggerFieldAnswer?.answer?.answer;

    if (!rawAnswer) return;

    let value: string[] = [];

    switch (rawAnswer.__typename) {
      case "FreeInputFieldAnswer":
        value = [rawAnswer.value];
        break;
      case "EntitiesFieldAnswer":
        value = rawAnswer.entities.map((e) => e.name);
        break;
      case "FlowsFieldAnswer":
        value = rawAnswer.flows.map((f) => f.flowName);
        break;
      case "WebhookFieldAnswer":
        value = [rawAnswer.uri];
        break;
      case "OptionFieldAnswer": {
        if (field.__typename !== FieldType.Options)
          throw new GraphQLError(
            `Options field answer not associated to options field. fieldId: ${field.fieldId}`,
            {
              extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
            },
          );
        value = rawAnswer.selections.map((s) => {
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

    requestFields.push({
      fieldName: field.name,
      value,
    });
  });

  return requestFields;
};
