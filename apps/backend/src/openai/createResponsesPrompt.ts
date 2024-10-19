import { UserFieldAnswer, UserFieldAnswers } from "@/graphql/generated/resolver-types";

export const createResponsesPrompt = ({ fieldAnswers }: { fieldAnswers: UserFieldAnswers[] }) => {
  if (fieldAnswers.length === 0)
    return "This request was designed to not have responses. Use the other information in the request to make a decision.";
  const formattedResponses = fieldAnswers
    .map((fieldAnswer) => createResponsePrompt({ fieldAnswers: fieldAnswer }))
    .join("\n\n");

  return `Here are the responses from this request so far: \n\n${formattedResponses}`;
};

const createResponsePrompt = ({ fieldAnswers }: { fieldAnswers: UserFieldAnswers }) => {
  if (fieldAnswers.answers.length === 0) {
    return "";
  }
  const formattedAnswers = fieldAnswers.answers
    .map((answer) => {
      return `- ${formatAnswer({ userFieldAnswer: answer })}`;
    })
    .join("\n");
  return `Question: ${fieldAnswers.fieldId} \n\nAnswers: \n${formattedAnswers}`;
};

const formatAnswer = ({ userFieldAnswer }: { userFieldAnswer: UserFieldAnswer }): string => {
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
      value = answer.selections.map((selection) => selection.optionId).join(", ");
      break;
    case "WebhookFieldAnswer":
      value = answer.uri;
      break;
    default:
      throw Error("Unhandled field answer type");
  }
  return `${userFieldAnswer.creator.name}: ${value}`;
};
