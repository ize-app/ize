import { ActionSchemaType } from "@/components/Form/FlowForm/formValidation/action";
import { FieldSchemaType } from "@/components/Form/FlowForm/formValidation/fields";
import {
  FlowSchemaType,
  FlowWithEvolveFlowSchemaType,
  StepSchemaType,
} from "@/components/Form/FlowForm/formValidation/flow";
import { PermissionSchemaType } from "@/components/Form/FlowForm/formValidation/permission";
import { ResultSchemaType } from "@/components/Form/FlowForm/formValidation/result";
import { getDefaultStepFormValues } from "@/components/Form/FlowForm/helpers/getDefaultFormValues";
import {
  ActionType,
  DecisionType,
  EntityType,
  FieldType,
  FlowType,
  OptionSelectionType,
  ResultType,
  UserSummaryPartsFragment,
} from "@/graphql/generated/graphql";

import { generateActionConfig } from "./generateActionConfig";
import { generateEvolveConfig } from "./generateEvolveConfig";
import { generateFieldConfig } from "./generateFieldConfig";
import { generateIdeaCreationStep } from "./generateIdeaCreationStep";
import { generateResultConfig } from "./generateResultConfig";
import { generateStepConfig } from "./generateStepConfig";
import {
  AIOutputType,
  ActionTriggerCondition,
  FlowGoal,
  IntitialFlowSetupSchemaType,
  PerspectiveResultType,
  Reusable,
} from "../formValidation";

export const generateNewFlowConfig = ({
  config,
  creator,
}: {
  config: IntitialFlowSetupSchemaType;
  creator: UserSummaryPartsFragment | null | undefined;
}): FlowWithEvolveFlowSchemaType => {
  const permission: PermissionSchemaType = config.permission;
  const creatorPermission: PermissionSchemaType = {
    anyone: false,
    entities: creator ? [{ ...creator, __typename: EntityType.User }] : [],
  };
  let ideationStep: StepSchemaType | null = null;
  let ideationResult: ResultSchemaType | null = null;

  let field: FieldSchemaType | null = null;
  let result: ResultSchemaType | null = null;
  let action: ActionSchemaType | undefined = undefined;
  let step: StepSchemaType | null = null;

  const stepId = crypto.randomUUID();
  const ideationStepId = crypto.randomUUID();

  let flowTitle: string = "New flow";

  const reusable = config.reusable === Reusable.Reusable;

  try {
    if (
      config.goal !== FlowGoal.GetPerspectives &&
      config.optionsConfig?.linkedOptions.hasLinkedOptions &&
      config.optionsConfig?.linkedOptions.question
    ) {
      [ideationStep, ideationResult] = generateIdeaCreationStep({
        stepId: ideationStepId,
        nextStepId: stepId,
        permission,
        question: config.optionsConfig.linkedOptions.question,
        useAi: config.optionsConfig.linkedOptions.useAi ?? false,
        prompt: config.optionsConfig.linkedOptions.prompt,
      });
    }

    switch (config.goal) {
      case FlowGoal.Decision: {
        // create options config
        field = generateFieldConfig({
          type: FieldType.Options,
          question: config.question,
          selectionType: DecisionType.WeightedAverage
            ? OptionSelectionType.Rank
            : OptionSelectionType.Select,
          options: config.optionsConfig.options,
          linkedResultId: ideationResult ? ideationResult?.resultConfigId : undefined,
          triggerDefinedOptions: config.optionsConfig.triggerDefinedOptions,
          decisionType: config.decision.type,
        });

        flowTitle = config.question;

        result = generateResultConfig({
          type: ResultType.Decision,
          fieldId: field.fieldId,
          decision: config.decision,
        });
        break;
      }
      case FlowGoal.Prioritize: {
        // same as prioritize
        field = generateFieldConfig({
          type: FieldType.Options,
          question: config.question,
          selectionType: OptionSelectionType.Rank,
          options: config.optionsConfig.options,
          linkedResultId: ideationResult ? ideationResult?.resultConfigId : undefined,
          triggerDefinedOptions: config.optionsConfig.triggerDefinedOptions,
        });

        flowTitle = config.question;

        result = generateResultConfig({ type: ResultType.Ranking, fieldId: field.fieldId });
        break;
      }
      case FlowGoal.GetPerspectives: {
        field = generateFieldConfig({
          type: FieldType.FreeInput,
          question: config.question,
        });

        flowTitle = config.question;

        if (config.result.type === PerspectiveResultType.Ai) {
          result = generateResultConfig({
            type: ResultType.LlmSummary,
            isList: config.result.aiOutputType === AIOutputType.List ? true : false,
            fieldId: field.fieldId,
            prompt: config.result.prompt ?? "",
          });
        } else {
          result = generateResultConfig({
            type: ResultType.RawAnswers,
            fieldId: field.fieldId,
          });
        }

        break;
      }
      case FlowGoal.TriggerWebhook: {
        let filterResultConfigId: null | string = null;
        if (
          config.webhookTriggerCondition === ActionTriggerCondition.Decision &&
          config.optionsConfig
        ) {
          field = generateFieldConfig({
            type: FieldType.Options,
            question: config.question ?? "Select one of the following options:", //todo: this should be a question
            selectionType:
              config.decision?.type === DecisionType.WeightedAverage
                ? OptionSelectionType.Rank
                : OptionSelectionType.Select,
            options: config.optionsConfig?.options,
            linkedResultId: ideationResult ? ideationResult?.resultConfigId : undefined,
            triggerDefinedOptions: config.optionsConfig.triggerDefinedOptions,
          });

          flowTitle = config.webhookName;

          result = generateResultConfig({
            type: ResultType.Decision,
            fieldId: field.fieldId,
            decision: config.decision ?? {
              type: DecisionType.NumberThreshold,
              threshold: 1,
            },
          });

          filterResultConfigId = result.resultConfigId;
        }

        action = generateActionConfig({
          type: ActionType.CallWebhook,
          webhookName: config.webhookName,
          filterOptionId: config.filterOptionId,
          filterResultConfigId,
        });

        break;
      }
    }
    step = generateStepConfig({
      stepId,
      permission,
      responseFields: field ? [field] : [],
      result: result ? [result] : [],
      action,
    });

    const evolve = generateEvolveConfig({
      triggerPermission: creatorPermission,
      respondPermission: permission,
    });

    const flow: FlowSchemaType = {
      flowVersionId: crypto.randomUUID(),
      type: FlowType.Custom,
      name: flowTitle,
      trigger: {
        permission,
      },
      fieldSet: {
        fields: [],
        locked: false,
      },
      steps: [ideationStep, step].filter((x) => x !== null),
    };

    return { flow, evolve, reusable };
  } catch (e) {
    console.log("Error: generateNewFlowConfig", e);
    const anyonePermission: PermissionSchemaType = { anyone: true, entities: [] };
    const flow = {
      flowVersionId: crypto.randomUUID(),
      name: "",
      type: FlowType.Custom,
      fieldSet: {
        fields: [],
        locked: false,
      },
      trigger: {
        permission: anyonePermission,
      },
      steps: [getDefaultStepFormValues()],
    };
    const evolve = generateEvolveConfig({
      triggerPermission: creatorPermission,
      respondPermission: creatorPermission,
    });
    return { flow, evolve, reusable };
  }
};
