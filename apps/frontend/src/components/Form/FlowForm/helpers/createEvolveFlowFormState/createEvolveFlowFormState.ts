import {
  Action,
  ActionType,
  Field,
  FieldType,
  Flow,
  LlmSummaryType,
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
import {
  DecisionResultSchemaType,
  LlmSummaryResultSchemaType,
  RankingResultSchemaType,
  ResultSchemaType,
} from "../../formValidation/result";
import { ActionSchemaType } from "../../formValidation/action";
import { EntitySchemaType } from "../../../formValidation/entity";
import { EvolveSchemaType } from "../../formValidation/evolve";

export const createFormStateForExistingFlow = (flow: Flow): FlowSchemaType => {
  return {
    name: flow.name,
    steps: flow.steps.map((step) => createStepFormState(step as Step)),
    evolve: createEvolveFormState(flow.evolve as Flow),
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
      fields: createFieldsFormState(step.response.fields),
    },
    result: createResultFormState(step.result),
    action: createActionFormState(step.action),
    expirationSeconds: step.expirationSeconds ?? undefined,
  };
};
const createPermissionFormState = (permission: Permission): PermissionSchemaType => {
  // return {
  //   type: (() => {
  //     if (permission.anyone) return {PermissionType.Anyone};
  //     else if (permission.stepTriggered) return PermissionType.Process;
  //     else return PermissionType.Entities;
  //   })(),
  //   entities: permission.entities as EntitySchemaType[],
  // };
  if (permission.anyone) return { type: PermissionType.Anyone };
  else if (permission.stepTriggered) return { type: PermissionType.Process };
  else
    return {
      type: PermissionType.Entities,
      entities: permission.entities.map((entity) => {
        if (entity.__typename === "Group")
          return { ...entity, groupType: { __typename: entity.groupType.__typename } };
        else if (entity.__typename === "Identity")
          return { ...entity, identityType: { __typename: entity.identityType.__typename } };
      }) as EntitySchemaType[],
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
        linkedResultOptions: field.linkedResultOptions.map((id) => ({ id })),
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

const createResultFormState = (results: ResultConfig[]): ResultSchemaType[] => {
  return results.map((result) => {
    switch (result.__typename) {
      case ResultType.Decision:
        const dec: DecisionResultSchemaType = {
          type: ResultType.Decision,
          fieldId: result.fieldId ?? null,
          resultId: result.resultConfigId,
          minimumAnswers: result.minimumAnswers,
          decision: {
            type: result.decisionType,
            threshold: result.threshold,
            defaultOptionId: result.defaultOption?.optionId ?? DefaultOptionSelection.None,
          },
        };
        return dec;
      case ResultType.Ranking:
        const rank: RankingResultSchemaType = {
          type: ResultType.Ranking,
          fieldId: result.fieldId ?? null,
          resultId: result.resultConfigId,
          minimumAnswers: result.minimumAnswers,
          prioritization: {
            numOptionsToInclude: result.numOptionsToInclude,
          },
        };
        return rank;
      case ResultType.LlmSummary:
        const llm: LlmSummaryResultSchemaType = {
          type: ResultType.LlmSummary,
          fieldId: result.fieldId ?? null,
          resultId: result.resultConfigId,
          minimumAnswers: result.minimumAnswers,
          llmSummary: {
            type: LlmSummaryType.AfterEveryResponse,
            prompt: result.prompt ?? undefined,
          },
        };
        return llm;
      default:
        throw Error("Unknown result type");
    }
  });
};

const createActionFormState = (action: Action | null | undefined): ActionSchemaType => {
  switch (action?.__typename) {
    case ActionType.CallWebhook:
      return {
        type: ActionType.CallWebhook,
        filterOptionId: action.filterOption?.optionId ?? DefaultOptionSelection.None,
        callWebhook: {
          name: action.name,
          uri: action.uri,
        },
      };
    case ActionType.TriggerStep:
      return {
        type: ActionType.TriggerStep,
        filterOptionId: action.filterOption?.optionId ?? DefaultOptionSelection.None,
      };
    case ActionType.EvolveFlow:
      return {
        type: ActionType.EvolveFlow,
        filterOptionId: action.filterOption?.optionId ?? DefaultOptionSelection.None,
      };
    default:
      return {
        type: ActionType.None,
      };
  }
};

const createEvolveFormState = (flow: Flow): EvolveSchemaType => {
  if (!flow.steps[0] || !(flow.steps[0].result[0].__typename === ResultType.Decision))
    throw Error("Invalid evolve flow state");
  return {
    requestPermission: createPermissionFormState(flow.steps[0].request.permission as Permission),
    responsePermission: createPermissionFormState(flow.steps[0].response.permission as Permission),
    decision: {
      type: flow.steps[0].result[0].decisionType,
      threshold: flow.steps[0].result[0].threshold,
      // defaultOptionId:
      //   flow.steps[0].result[0].defaultOption?.optionId ?? DefaultOptionSelection.None,
    },
  };
};
