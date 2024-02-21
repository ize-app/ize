import {
  ActionNew,
  ActionNewType,
  Field,
  FieldType,
  Flow,
  Permission,
  ResultConfig,
  ResultType,
  Step,
} from "@/graphql/generated/graphql";
import { FlowSchemaType, StepSchemaType } from "../../formValidation/flow";
import { PermissionSchemaType, PermissionType } from "../../formValidation/permission";
import {
  DefaultOptionSelection,
  FieldOptionSchemaType,
  FieldOptionsSchemaType,
  FieldSchemaType,
  FieldsSchemaType,
} from "../../formValidation/fields";
import { ResultSchemaType } from "../../formValidation/result";
import { ActionSchemaType } from "../../formValidation/action";
import { EntitySchemaType } from "../../formValidation/entity";
import { EvolveSchemaType } from "../../formValidation/evolve";

export const createFormStateForExistingFlow = (flow: Flow): FlowSchemaType => {
  return {
    name: flow.name,
    reusable: flow.reusable,
    steps: flow.steps.map((step) => createStepFormState(step as Step)),
    evolve: createEvolveFormState(flow),
  };
};

// current state
// flow graphql ---> always returns request / response object but permission/fields can be null
// form ---> request object is optional if step > 0, fields are optional always, request fields aren't necessarily rendered

const createStepFormState = (step: Step): StepSchemaType => {
  return {
    request: {
      permission: createPermissionFormState(step.request.permission),
      fields: createFieldsFormState(step.request.fields),
    },
    response: {
      permission: createPermissionFormState(step.response.permission),
      field: createFieldFormState(step.response.fields[0]),
    },
    result: createResultFormState(step.result),
    action: createActionFormState(step.action),
  };
};

const createPermissionFormState = (permission: Permission): PermissionSchemaType => {
  return {
    type: (() => {
      if (permission.anyone) return PermissionType.Anyone;
      else if (permission.stepTriggered) return PermissionType.Process;
      else return PermissionType.Entities;
    })(),
    entities: permission.entities as EntitySchemaType[],
  };
};

const createFieldsFormState = (fields: Field[]): FieldsSchemaType => {
  return fields.map((field) => createFieldFormState(field));
};

const createFieldFormState = (field: Field): FieldSchemaType => {
  const { fieldId, name, required } = field;
  switch (field.__typename) {
    case FieldType.FreeInput:
      return {
        type: FieldType.FreeInput,
        fieldId,
        name,
        required,
        freeInputDataType: field.dataType,
      };
    case FieldType.Options:
      const optionsConfig: FieldOptionsSchemaType = {
        previousStepOptions: field.previousStepOptions,
        hasRequestOptions: field.hasRequestOptions,
        requestOptionsDataType: field.requestOptionsDataType ?? undefined,
        maxSelections: field.maxSelections,
        selectionType: field.selectionType,
        options: field.options.map(
          (o): FieldOptionSchemaType => ({
            optionId: o.optionId,
            name: o.name,
            dataType: o.dataType,
          }),
        ),
      };
      return { type: FieldType.Options, fieldId, name, required, optionsConfig };
    default:
      throw Error("Invalid field type");
  }
};

const createResultFormState = (result: ResultConfig): ResultSchemaType => {
  console.log("creating result form state for ", result);
  switch (result.__typename) {
    case ResultType.Decision:
      return {
        type: ResultType.Decision,
        requestExpirationSeconds: result.requestExpirationSeconds,
        minimumResponses: result.minimumAnswers,
        decision: {
          type: result.decisionType,
          threshold: result.threshold,
          defaultOptionId: result.defaultOption?.optionId ?? DefaultOptionSelection.None,
        },
      };
    case ResultType.Ranking:
      return {
        type: ResultType.Ranking,
        requestExpirationSeconds: result.requestExpirationSeconds,
        minimumResponses: result.minimumAnswers,
        prioritization: {
          numOptionsToInclude: result.numOptionsToInclude,
        },
      };
    case ResultType.LlmSummary:
      return {
        type: ResultType.LlmSummary,
        requestExpirationSeconds: result.requestExpirationSeconds,
        minimumResponses: result.minimumAnswers,
        llmSummary: {
          type: result.summaryType,
          prompt: result.prompt ?? undefined,
        },
      };
    case ResultType.AutoApprove:
      return {
        type: ResultType.AutoApprove,
      };
    case ResultType.Raw:
      return {
        type: ResultType.Raw,
        requestExpirationSeconds: result.requestExpirationSeconds,
        minimumResponses: result.minimumAnswers,
      };
    default:
      throw Error("Unknown result type");
  }
};

const createActionFormState = (action: ActionNew | null | undefined): ActionSchemaType => {
  switch (action?.__typename) {
    case ActionNewType.CallWebhook:
      return {
        type: ActionNewType.CallWebhook,
        filterOptionId: action.filterOption?.optionId ?? DefaultOptionSelection.None,
        callWebhook: {
          name: action.name,
          uri: action.uri,
        },
      };
    case ActionNewType.TriggerStep:
      return {
        type: ActionNewType.TriggerStep,
        filterOptionId: action.filterOption?.optionId ?? DefaultOptionSelection.None,
      };
    case ActionNewType.EvolveFlow:
      return {
        type: ActionNewType.EvolveFlow,
        filterOptionId: action.filterOption?.optionId ?? DefaultOptionSelection.None,
      };
    default:
      return {
        type: ActionNewType.None,
      };
  }
};

const createEvolveFormState = (flow: Flow | null): EvolveSchemaType | undefined => {
  if (!flow) return undefined;
  if (!flow.steps[0] || !(flow.steps[0].result.__typename === ResultType.Decision))
    throw Error("Invalid evolve flow state");
  return {
    requestPermission: createPermissionFormState(flow.steps[0].request.permission as Permission),
    responsePermission: createPermissionFormState(flow.steps[0].response.permission as Permission),
    decision: {
      type: flow.steps[0].result.decisionType,
      threshold: flow.steps[0].result.threshold,
      defaultOptionId: flow.steps[0].result.defaultOption?.optionId ?? DefaultOptionSelection.None,
    },
  };
};
