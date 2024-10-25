import { stringifyFieldAnswer } from "@/core/request/createRequestPayload/stringifyFieldAnswer";
import { ResponseFieldAnswers } from "@/graphql/generated/resolver-types";

export const createResponsesPrompt = ({
  fieldAnswers,
}: {
  fieldAnswers: ResponseFieldAnswers[];
}) => {
  if (fieldAnswers.length === 0)
    return "This request was designed to not have responses. Use the other information in the request to make a decision.";
  const formattedResponses = fieldAnswers
    .map((fieldAnswer) => createResponsePrompt({ fieldAnswers: fieldAnswer }))
    .join("\n\n");

  return `Here are the responses from this request so far: \n\n${formattedResponses}`;
};

const createResponsePrompt = ({ fieldAnswers }: { fieldAnswers: ResponseFieldAnswers }) => {
  if (fieldAnswers.answers.length === 0) {
    return "";
  }
  const formattedAnswers = fieldAnswers.answers
    .map((answer) => {
      return `- ${stringifyFieldAnswer({ userFieldAnswer: answer, field: fieldAnswers.field })}`;
    })
    .join("\n");
  return `Question: ${fieldAnswers.field.name} \n\nAnswers: \n${formattedAnswers}`;
};
