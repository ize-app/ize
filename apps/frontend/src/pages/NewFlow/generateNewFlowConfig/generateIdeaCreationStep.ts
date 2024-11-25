import { StepSchemaType } from "@/components/Form/FlowForm/formValidation/flow";
import { PermissionSchemaType } from "@/components/Form/FlowForm/formValidation/permission";
import { ResultSchemaType } from "@/components/Form/FlowForm/formValidation/result";
import { ActionType, FieldType, ResultType } from "@/graphql/generated/graphql";

import { generateActionConfig } from "./generateActionConfig";
import { generateFieldConfig } from "./generateFieldConfig";
import { generateResultConfig } from "./generateResultConfig";
import { generateStepConfig } from "./generateStepConfig";

export const generateIdeaCreationStep = ({
  stepId,
  nextStepId,
  question,
  permission,
}: {
  stepId: string;
  nextStepId: string;
  question: string;
  permission: PermissionSchemaType;
}): [StepSchemaType, ResultSchemaType] => {
  const field = generateFieldConfig({
    type: FieldType.FreeInput,
    question,
  });
  const result = generateResultConfig({
    type: ResultType.LlmSummary,
    fieldId: field.fieldId,
    prompt: "",
    isList: true,
  });

  const step = generateStepConfig({
    stepId,
    permission,
    responseFields: [field],
    result: [result],
    action: generateActionConfig({ type: ActionType.TriggerStep, nextStepId }),
  });

  return [step, result];
};
