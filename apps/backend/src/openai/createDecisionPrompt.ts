import { FieldType } from "@prisma/client";

import { Field } from "@/graphql/generated/resolver-types";

export interface AiDecisionResult {
  optionNumber: number;
  explanation: string;
}

const exampleDecision1: AiDecisionResult = {
  optionNumber: 2,
  explanation: "This option balances consideration A and B. Though the downside is consideration C",
};

const exampleDecision2: AiDecisionResult = {
  optionNumber: 3,
  explanation:
    "There wasn't enough context to make an informed decision, but this option is reasonable given the goals of the request",
};

export const createDecisionPrompt = ({
  field,
  criteria,
}: {
  field: Field;
  criteria: string | null;
}): string => {
  if (field.__typename !== FieldType.Options)
    throw Error(`Field is not an options field ${field.fieldId}`);

  const defaultDecisionCriteria =
    "Using the context provided about the request and responses provided, choose an opton that reflects both the goals of this request and the preferences of the respondants (if there are any responses).";

  const criteriaInstructions = `Your decision must incororate the following decision criteria: ${criteria ? `${criteria}` : defaultDecisionCriteria}`;

  const fieldInstructions = `You must make a decision for the following question: ${field.name}`;

  const options = field.options.map((option, index) => ({
    optionNumber: index,
    value: option.name,
  }));

  const chooseOptionInstructions = `Decide one of the following options:\n ${JSON.stringify(options)} `;

  const outputInstructions = `Provide the number of the option you are selecting and a brief explanation in the following example JSON formats: \n ${JSON.stringify(exampleDecision1)}\n\n ${JSON.stringify(exampleDecision2)}`;

  return `${fieldInstructions}\n\n${criteriaInstructions}\n\n${chooseOptionInstructions}\n\n${outputInstructions}`;
};
