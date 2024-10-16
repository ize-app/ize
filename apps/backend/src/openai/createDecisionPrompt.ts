import { FieldType } from "@prisma/client";

import { DecisionResult } from "@/core/result/decision/determineDecision";
import { Field } from "@/graphql/generated/resolver-types";

const exampleDecision: DecisionResult = {
  optionId: "1",
  explanation: "criteria",
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

  const options = field.options.map((option) => ({
    optionId: option.optionId,
    value: option.name,
  }));

  const chooseOptionInstructions = `Decide one of the following options:\n ${JSON.stringify(options)} `;

  const outputInstructions = `Provide your decision optionId and a brief explanation in the following JSON format: \n ${JSON.stringify(exampleDecision)}`;

  return `${fieldInstructions}\n\n${criteriaInstructions}\n\n${chooseOptionInstructions}\n\n${outputInstructions}`;
};
