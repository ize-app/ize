import { ActionSchemaType } from "@/components/Form/FlowForm/formValidation/action";
import {
  DefaultOptionSelection,
  FieldSchemaType,
} from "@/components/Form/FlowForm/formValidation/fields";
import { FlowSchemaType, StepSchemaType } from "@/components/Form/FlowForm/formValidation/flow";
import {
  PermissionSchemaType,
  PermissionType,
} from "@/components/Form/FlowForm/formValidation/permission";
import { ResultSchemaType } from "@/components/Form/FlowForm/formValidation/result";
import { defaultStepFormValues } from "@/components/Form/FlowForm/helpers/getDefaultFormValues";
import {
  ActionType,
  DecisionType,
  FieldOptionsSelectionType,
  FieldType,
  ResultType,
} from "@/graphql/generated/graphql";

import { generateActionConfig } from "./generateActionConfig";
import { generateFieldConfig } from "./generateFieldConfig";
import { generateIdeaCreationStep } from "./generateIdeaCreationStep";
import { generateResultConfig } from "./generateResultConfig";
import { generateStepConfig } from "./generateStepConfig";
import {
  AIOutputType,
  ActionTriggerCondition,
  FlowGoal,
  IntitialFlowSetupSchemaType,
} from "../formValidation";

export const generateNewFlowConfig = ({
  config,
}: {
  config: IntitialFlowSetupSchemaType;
}): FlowSchemaType => {
  const permission: PermissionSchemaType = config.permission;
  let ideationStep: StepSchemaType | null = null;
  let ideationResult: ResultSchemaType | null = null;

  let field: FieldSchemaType | null = null;
  let result: ResultSchemaType | null = null;
  let action: ActionSchemaType | undefined = undefined;
  let step: StepSchemaType | null = null;

  let flowTitle: string = "New flow";
  if (
    config.goal !== FlowGoal.AiSummary &&
    config.optionsConfig?.linkedOptions.hasLinkedOptions &&
    config.optionsConfig?.linkedOptions.question
  ) {
    [ideationStep, ideationResult] = generateIdeaCreationStep({
      permission,
      question: config.optionsConfig.linkedOptions.question,
    });
  }
  try {
    switch (config.goal) {
      case FlowGoal.Decision: {
        // create options config
        field = generateFieldConfig({
          type: FieldType.Options,
          question: config.question,
          selectionType: FieldOptionsSelectionType.Select,
          options: config.optionsConfig.options,
          linkedResultId: ideationResult ? ideationResult?.resultId : undefined,
          requestCreatedOptions: config.optionsConfig.requestCreatedOptions,
        });

        flowTitle = config.question;

        result = generateResultConfig({ type: ResultType.Decision, fieldId: field.fieldId });
        break;
      }
      case FlowGoal.Prioritize: {
        // same as prioritize
        field = generateFieldConfig({
          type: FieldType.Options,
          question: config.question,
          selectionType: FieldOptionsSelectionType.Rank,
          options: config.optionsConfig.options,
          linkedResultId: ideationResult ? ideationResult?.resultId : undefined,
          requestCreatedOptions: config.optionsConfig.requestCreatedOptions,
        });

        flowTitle = config.question;

        result = generateResultConfig({ type: ResultType.Ranking, fieldId: field.fieldId });
        break;
      }
      case FlowGoal.AiSummary: {
        field = generateFieldConfig({
          type: FieldType.FreeInput,
          question: config.question,
        });

        flowTitle = config.question;

        result = generateResultConfig({
          type:
            config.aiOutputType === AIOutputType.List
              ? ResultType.LlmSummaryList
              : ResultType.LlmSummary,
          fieldId: field.fieldId,
          prompt: config.prompt,
          example: config.example,
        });
        break;
      }
      case FlowGoal.TriggerWebhook: {
        if (
          config.webhookTriggerCondition === ActionTriggerCondition.Decision &&
          config.optionsConfig
        ) {
          field = generateFieldConfig({
            type: FieldType.Options,
            question: "Select one of the following options:", //todo: this should be a question
            selectionType: FieldOptionsSelectionType.Select,
            options: config.optionsConfig?.options,
            linkedResultId: ideationResult ? ideationResult?.resultId : undefined,
            requestCreatedOptions: config.optionsConfig?.requestCreatedOptions,
          });

          flowTitle = config.webhookName;

          result = generateResultConfig({ type: ResultType.Decision, fieldId: field.fieldId });
        }

        action = generateActionConfig({
          type: ActionType.CallWebhook,
          webhookName: config.webhookName,
          filterOptionId: config.filterOptionId,
        });

        break;
      }
    }
    step = generateStepConfig({
      permission,
      requestFields: [],
      responseFields: field ? [field] : [],
      result: result ? [result] : [],
      action,
    });

    const flow = {
      name: flowTitle,
      evolve: {
        requestPermission: permission,
        responsePermission: permission, // TODO switch out for creator
        decision: {
          type: DecisionType.NumberThreshold,
          threshold: 1,
          defaultOptionId: DefaultOptionSelection.None,
        },
      },
      steps: [ideationStep, step].filter((x) => x !== null) as StepSchemaType[],
    };
    return flow;
  } catch (e) {
    console.log("Error: generateNewFlowConfig", e);
    return {
      name: "",
      evolve: {
        requestPermission: { type: PermissionType.Anyone, entities: [] },
        responsePermission: { type: PermissionType.Anyone, entities: [] },
        decision: {
          type: DecisionType.NumberThreshold,
          threshold: 1,
        },
      },
      steps: [defaultStepFormValues],
    };
  }
};
