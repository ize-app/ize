import { GenericFieldAndValue } from "@/graphql/generated/resolver-types";

const formatFieldAndValue = (fieldAndValue: GenericFieldAndValue): string => {
  return `${fieldAndValue.fieldName}: \n${fieldAndValue.value.reduce((acc, value) => {
    return `${acc}- ${value}\n`;
  }, "")}`;
};

export const createRequestContextPrompt = ({
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
  return `Here is context about the results from this request so far \n\nRequest name: [${flowName}] ${requestName}\n${[
    ...requestResults,
    ...requestTriggerAnswers,
  ].reduce((acc, { fieldName, value }) => {
    return formatFieldAndValue({ fieldName, value });
  }, "")}`;
};
