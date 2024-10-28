import {
  Field,
  FieldType,
  ResponseFieldAnswers,
  UserFieldAnswer,
} from "@/graphql/generated/resolver-types";

export const stringifyFieldResponses = ({
  fieldAnswers,
}: {
  fieldAnswers: ResponseFieldAnswers[];
}) => {
  return fieldAnswers
    .map((fieldAnswer) => stringifyFieldResponse({ fieldAnswers: fieldAnswer }))
    .join("\n\n");
};

const stringifyFieldResponse = ({ fieldAnswers }: { fieldAnswers: ResponseFieldAnswers }) => {
  if (fieldAnswers.answers.length === 0) {
    return "";
  }
  const formattedAnswers = fieldAnswers.answers
    .map((answer) => {
      return `- ${stringifyFieldAnswer({ userFieldAnswer: answer, field: fieldAnswers.field })}`;
    })
    .join("\n");
  return `Question: ${fieldAnswers.field.name} \nAnswers: \n${formattedAnswers}`;
};

const stringifyFieldAnswer = ({
  userFieldAnswer,
  field,
}: {
  userFieldAnswer: UserFieldAnswer;
  field: Field;
}): string => {
  const answer = userFieldAnswer.answer;
  let value: string;
  switch (answer.__typename) {
    case "EntitiesFieldAnswer":
      value = answer.entities.map((entity) => entity.name).join(", ");
      break;
    case "FlowsFieldAnswer":
      value = answer.flows.map((flow) => flow.flowName).join(", ");
      break;
    case "FreeInputFieldAnswer":
      value = answer.value;
      break;
    // TODO need to fix this
    case "OptionFieldAnswer":
      if (field.__typename !== FieldType.Options)
        throw Error("Option field answer not associated to option field");
      value = answer.selections
        .map((selection): string => {
          const option = field.options.find((option) => option.optionId === selection.optionId);
          if (!option) throw Error("Option answer not found on options field");
          return option.name;
        })
        .join(", ");
      break;
    case "WebhookFieldAnswer":
      value = answer.uri;
      break;
    default:
      throw Error("Unhandled field answer type");
  }
  return `${userFieldAnswer.creator.name}: ${value}`;
};
