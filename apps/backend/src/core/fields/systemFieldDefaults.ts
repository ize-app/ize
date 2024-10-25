import {
  FieldArgs,
  FieldDataType,
  FieldType,
  SystemFieldType,
} from "@/graphql/generated/resolver-types";

// TODO: have backend/frontend share same default file

export const systemFieldDefaults: Record<SystemFieldType, FieldArgs> = {
  [SystemFieldType.EvolveFlowProposed]: {
    type: FieldType.FreeInput,
    fieldId: crypto.randomUUID(),
    isInternal: false,
    systemType: SystemFieldType.EvolveFlowProposed,
    freeInputDataType: FieldDataType.FlowVersionId,
    name: "Proposed flow",
    required: true,
  },

  [SystemFieldType.EvolveFlowCurrent]: {
    type: FieldType.FreeInput,
    fieldId: crypto.randomUUID(),
    systemType: SystemFieldType.EvolveFlowCurrent,
    isInternal: false,
    freeInputDataType: FieldDataType.FlowVersionId,
    name: "Current flow",
    required: true,
  },

  [SystemFieldType.EvolveFlowDescription]: {
    type: FieldType.FreeInput,
    fieldId: crypto.randomUUID(),
    systemType: SystemFieldType.EvolveFlowDescription,
    isInternal: false,
    freeInputDataType: FieldDataType.FlowVersionId,
    name: "Description of changes",
    required: false,
  },

  [SystemFieldType.GroupName]: {
    type: FieldType.FreeInput,
    systemType: SystemFieldType.GroupName,
    isInternal: false,
    fieldId: "name",
    freeInputDataType: FieldDataType.String,
    name: "Group name",
    required: true,
  },

  [SystemFieldType.GroupDescription]: {
    type: FieldType.FreeInput,
    fieldId: crypto.randomUUID(),
    systemType: SystemFieldType.GroupDescription,
    isInternal: false,
    freeInputDataType: FieldDataType.String,
    name: "Group description",
    required: false,
  },

  [SystemFieldType.GroupMembers]: {
    type: FieldType.FreeInput,
    fieldId: crypto.randomUUID(),
    systemType: SystemFieldType.GroupMembers,
    isInternal: false,
    freeInputDataType: FieldDataType.EntityIds,
    name: "Membership definition",
    required: true,
  },

  [SystemFieldType.WatchFlow]: {
    type: FieldType.FreeInput,
    fieldId: crypto.randomUUID(),
    systemType: SystemFieldType.WatchFlow,
    isInternal: false,
    freeInputDataType: FieldDataType.FlowIds,
    name: "Membership definition",
    required: true,
  },

  [SystemFieldType.UnwatchFlow]: {
    type: FieldType.FreeInput,
    fieldId: crypto.randomUUID(),
    isInternal: false,
    systemType: SystemFieldType.UnwatchFlow,
    freeInputDataType: FieldDataType.FlowIds,
    name: "Membership definition",
    required: true,
  },
};
