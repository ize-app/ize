import { stringifyValue } from "@/core/request/stringify/stringifyInput";
import { Field } from "@/graphql/generated/resolver-types";

export interface AiDecisionResult {
  optionNumber: number;
  explanation: string;
}

const exampleDecision1: AiDecisionResult = {
  optionNumber: 1,
  explanation: "This option balances consideration A and B. Though the downside is consideration C",
};

const exampleDecision2: AiDecisionResult = {
  optionNumber: 2,
  explanation:
    "There wasn't enough context to make an informed decision, but this option is reasonable given the goals of the request",
};

const exampleDecision3: AiDecisionResult = {
  optionNumber: 3,
  explanation: "The request was vague, so I took my best guess.",
};

const exampleDecision4: AiDecisionResult = {
  optionNumber: 4,
  explanation: "The request is vague, but this option looks reasonable.",
};

const exampleDecision5: AiDecisionResult = {
  optionNumber: 5,
  explanation: "This option balances consideration A and B. Though the downside is consideration C",
};

const exampleDecision6: AiDecisionResult = {
  optionNumber: 6,
  explanation: "The request was vague, so I took my best guess.",
};

export const createDecisionPrompt = ({
  field,
  criteria,
  hasResponse,
}: {
  field: Field;
  criteria: string | null;
  hasResponse: boolean;
}): string => {
  if (!field.optionsConfig) throw Error(`Field is not an options field ${field.fieldId}`);

  const fieldInstructions = `You must make a decision for the following question: ${field.name}`;
  const defaultDecisionCriteria = hasResponse
    ? "Consider the goals of the request and the preferences of the respondants. Make a decision that balances the needs of the group and the goals of the request."
    : "Consider the goals of the request and make a decision that best aligns with the goals of the request.";

  const criteriaInstructions = `Your decision must incororate the following decision criteria: ${criteria ? `${criteria}` : defaultDecisionCriteria}`;

  const options = field.optionsConfig.options.map((option, index) => ({
    optionNumber: index + 1,
    value: stringifyValue(option.value),
  }));

  const chooseOptionInstructions = `Decide one of the following options:\n ${JSON.stringify(options)} `;

  const outputInstructions = `Provide the number of the option you are selecting and a brief explanation about why you are selecting that option. There are only ${options.length} options, so you must select an option number integer between 1 and ${options.length} Provide your response in the following example JSON formats: \n ${JSON.stringify(exampleDecision1)}\n\n ${JSON.stringify(exampleDecision2)}\n\n ${JSON.stringify(exampleDecision3)}\n\n ${JSON.stringify(exampleDecision4)}\n\n ${JSON.stringify(exampleDecision5)}\n\n ${JSON.stringify(exampleDecision6)}`;

  return `${fieldInstructions}\n\n${criteriaInstructions}\n\n${chooseOptionInstructions}\n\n${outputInstructions}`;
};
