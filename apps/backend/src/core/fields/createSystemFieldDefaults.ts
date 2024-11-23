import {
  FieldArgs,
  FieldDataType,
  FieldType,
  SystemFieldType,
} from "@/graphql/generated/resolver-types";

// TODO: have backend/frontend share same default file

export const createSystemFieldDefaults = (type: SystemFieldType): FieldArgs => {
  const defaults = systemFieldDefaults[type];
  return {
    ...defaults,
    fieldId: crypto.randomUUID(),
  };
};

const systemFieldDefaults: Record<SystemFieldType, Omit<FieldArgs, "fieldId">> = {
  [SystemFieldType.EvolveFlowProposed]: {
    type: FieldType.FreeInput,
    isInternal: false,
    systemType: SystemFieldType.EvolveFlowProposed,
    freeInputDataType: FieldDataType.FlowVersionId,
    name: "Proposed flow",
    required: true,
  },

  [SystemFieldType.EvolveFlowCurrent]: {
    type: FieldType.FreeInput,
    systemType: SystemFieldType.EvolveFlowCurrent,
    isInternal: false,
    freeInputDataType: FieldDataType.FlowVersionId,
    name: "Current flow",
    required: true,
  },

  [SystemFieldType.EvolveFlowDescription]: {
    type: FieldType.FreeInput,
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
    freeInputDataType: FieldDataType.String,
    name: "Group name",
    required: true,
  },

  [SystemFieldType.GroupDescription]: {
    type: FieldType.FreeInput,
    systemType: SystemFieldType.GroupDescription,
    isInternal: false,
    freeInputDataType: FieldDataType.String,
    name: "Group description",
    required: false,
  },

  [SystemFieldType.GroupMembers]: {
    type: FieldType.FreeInput,
    systemType: SystemFieldType.GroupMembers,
    isInternal: false,
    freeInputDataType: FieldDataType.EntityIds,
    name: "Membership definition",
    required: true,
  },

  [SystemFieldType.WatchFlow]: {
    type: FieldType.FreeInput,
    systemType: SystemFieldType.WatchFlow,
    isInternal: false,
    freeInputDataType: FieldDataType.FlowIds,
    name: "Flows to watch",
    required: false,
  },

  [SystemFieldType.UnwatchFlow]: {
    type: FieldType.FreeInput,
    isInternal: false,
    systemType: SystemFieldType.UnwatchFlow,
    freeInputDataType: FieldDataType.FlowIds,
    name: "Flows to unwatch",
    required: false,
  },
};
