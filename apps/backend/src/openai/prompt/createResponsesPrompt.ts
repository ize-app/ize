import { stringifyFieldResponses } from "@/core/request/stringify/stringifyResponses";
import { Request, ResponseFieldAnswers, ValueType } from "@/graphql/generated/resolver-types";

export const createResponsesPrompt = ({
  request,
  fieldId,
}: {
  request: Request;
  // limit responses to a single field
  fieldId?: string | undefined;
}) => {
  const fieldAnswers: ResponseFieldAnswers[] = [];
  request.requestSteps.forEach((requestStep) => {
    requestStep.answers
      .filter((answer) => answer.field.type !== ValueType.OptionSelections)
      .forEach((answer) => {
        if (fieldId && answer.field.fieldId !== fieldId) return;
        if (answer.answers.length > 0) fieldAnswers.push(answer);
        return;
      });
  });

  const noFieldAnswersDefault =
    "This request was designed to not have responses. Use the other information in the request to create your ouput";

  const fieldAnswersString =
    fieldAnswers.length > 0 ? stringifyFieldResponses({ fieldAnswers }) : noFieldAnswersDefault;

  return `#Responses\n\n${fieldAnswersString}`;
};
