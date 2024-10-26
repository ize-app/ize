import { stringifyFieldResponses } from "@/core/request/stringify/stringifyResponses";
import { ResponseFieldAnswers } from "@/graphql/generated/resolver-types";

export const createResponsesPrompt = ({
  fieldAnswers,
}: {
  fieldAnswers: ResponseFieldAnswers[];
}) => {
  if (fieldAnswers.length === 0)
    return "This request was designed to not have responses. Use the other information in the request to create your ouput";

  return `Here are the responses from this request: \n\n${stringifyFieldResponses({ fieldAnswers })}`;
};
