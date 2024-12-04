import { StepSchemaType } from "@/components/Form/FlowForm/formValidation/flow";
import { PermissionSchemaType } from "@/components/Form/FlowForm/formValidation/permission";
import { ResultSchemaType } from "@/components/Form/FlowForm/formValidation/result";
import { ActionType, ResultType, ValueType } from "@/graphql/generated/graphql";

import { generateActionConfig } from "./generateActionConfig";
import { generateFieldConfig } from "./generateFieldConfig";
import { generateResultConfig } from "./generateResultConfig";
import { generateStepConfig } from "./generateStepConfig";

export const generateIdeaCreationStep = ({
  stepId,
  nextStepId,
  question,
  permission,
  useAi,
  prompt,
}: {
  stepId: string;
  nextStepId: string;
  question: string;
  useAi: boolean;
  prompt?: string;
  permission: PermissionSchemaType;
}): [StepSchemaType, ResultSchemaType] => {
  const field = generateFieldConfig({
    type: ValueType.String,
    question,
  });

  const result = useAi
    ? generateResultConfig({
        type: ResultType.LlmSummary,
        fieldId: field.fieldId,
        prompt: prompt ?? "",
        isList: true,
      })
    : generateResultConfig({ type: ResultType.RawAnswers, fieldId: field.fieldId });

  const step = generateStepConfig({
    stepId,
    permission,
    responseFields: [field],
    result: [result],
    action: generateActionConfig({ type: ActionType.TriggerStep, nextStepId }),
  });

  return [step, result];
};
