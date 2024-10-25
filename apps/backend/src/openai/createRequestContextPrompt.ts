import { GenericFieldAndValue } from "@/graphql/generated/resolver-types";

const formatFieldAndValue = (fieldAndValue: GenericFieldAndValue): string => {
  return `${fieldAndValue.fieldName}: \n${fieldAndValue.value.reduce((acc, value) => {
    return `${acc}- ${value}\n`;
  }, "")}`;
};

export const createRequestContextPrompt = ({
  flowName,
  requestName,
  results,
  requestTriggerAnswers,
}: {
  flowName: string;
  requestName: string;
  results: GenericFieldAndValue[];
  requestTriggerAnswers: GenericFieldAndValue[];
}): string => {
  return `Here is context about the results from this request so far \n\nRequest name: [${flowName}] ${requestName}\n${[
    ...results,
    ...requestTriggerAnswers,
  ].reduce((acc, { fieldName, value }) => {
    return formatFieldAndValue({ fieldName, value });
  }, "")}`;
};
