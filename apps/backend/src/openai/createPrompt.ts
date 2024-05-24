import { GenericFieldAndValue } from "@/graphql/generated/resolver-types";

export const createPrompt = ({
  flowName,
  requestName,
  requestTriggerAnswers,
  requestResults,
  summaryPrompt,
  fieldName,
  responses,
}: {
  requestName: string;
  flowName: string;
  fieldName: string;
  requestTriggerAnswers: GenericFieldAndValue[];
  requestResults: GenericFieldAndValue[];
  summaryPrompt: string;
  responses: string[];
}) => {
  const context = formatRequestContext({
    flowName,
    requestName,
    requestResults,
    requestTriggerAnswers,
  });

  const formattedResponses = formatResponses(responses);

  const prompt = `${context}\n\n Question: ${fieldName}. \n\n Summarization instructions: ${summaryPrompt} \n\n
      Responses: ${formattedResponses}`;

  return prompt;
};

const formatFieldAndValue = (fieldAndValue: GenericFieldAndValue): string => {
  return `${fieldAndValue.fieldName}: \n${fieldAndValue.value.reduce((acc, value) => {
    return `${acc}- ${value}\n`;
  }, "")}`;
};

const formatRequestContext = ({
  flowName,
  requestName,
  requestResults,
  requestTriggerAnswers,
}: {
  flowName: string;
  requestName: string;
  requestResults: GenericFieldAndValue[];
  requestTriggerAnswers: GenericFieldAndValue[];
}): string => {
  return `Request context\n\nRequest name: [${flowName}] ${requestName}\n${[
    ...requestResults,
    ...requestTriggerAnswers,
  ].reduce((acc, { fieldName, value }) => {
    return formatFieldAndValue({ fieldName, value });
  }, "")}`;
};

const formatResponses = (responses: string[]): string => {
  return responses.reduce((acc, response, index) => `${acc}- ${response}\n`, "");
};
