import { FieldArgs, SystemFieldType, ValueType } from "@/graphql/generated/resolver-types";

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
    type: ValueType.FlowVersion,
    isInternal: false,
    systemType: SystemFieldType.EvolveFlowProposed,
    name: "Proposed flow",
    required: true,
  },

  [SystemFieldType.EvolveFlowCurrent]: {
    type: ValueType.FlowVersion,
    systemType: SystemFieldType.EvolveFlowCurrent,
    isInternal: false,
    name: "Current flow",
    required: true,
  },

  [SystemFieldType.EvolveFlowDescription]: {
    type: ValueType.String,
    systemType: SystemFieldType.EvolveFlowDescription,
    isInternal: false,
    name: "Description of changes",
    required: false,
  },

  [SystemFieldType.GroupName]: {
    type: ValueType.String,
    systemType: SystemFieldType.GroupName,
    isInternal: false,
    name: "Group name",
    required: true,
  },

  [SystemFieldType.GroupDescription]: {
    type: ValueType.String,
    systemType: SystemFieldType.GroupDescription,
    isInternal: false,
    name: "Group description",
    required: false,
  },

  [SystemFieldType.GroupMembers]: {
    type: ValueType.Entities,
    systemType: SystemFieldType.GroupMembers,
    isInternal: false,
    name: "Membership definition",
    required: true,
  },

  [SystemFieldType.WatchFlow]: {
    type: ValueType.Flows,
    systemType: SystemFieldType.WatchFlow,
    isInternal: false,
    name: "Flows to watch",
    required: false,
  },

  [SystemFieldType.UnwatchFlow]: {
    type: ValueType.Flows,
    isInternal: false,
    systemType: SystemFieldType.UnwatchFlow,
    name: "Flows to unwatch",
    required: false,
  },
};
