// TODO: convert all of these into graphql types

export enum PermissionType {
  Entities = "Entities",
  Anyone = "Anyone",
  Process = "Process",
}

export enum ResponseInputs {
  Agents = "Agents",
  Anyone = "Anyone",
}

export enum StepType {
  GetInput = "GetInput",
  Decide = "Decide",
  Prioritize = "Prioritize",
}

export enum RespondInputType {
  FreeInput = "FreeInput",
  SelectOption = "SelectOption",
  RankOptions = "RankOptions",
  GroupOptions = "GroupOptions",
}

export enum InputDataType {
  String = "String",
  Number = "Number",
  Uri = "Uri",
  Date = "Date",
  DateTime = "DateTime",
}

export enum OptionDataType {
  String = "String",
  Number = "Number",
  Uri = "Uri",
}

export enum OptionsCreationType {
  ProcessDefinedOptions = "ProcessDefinedOptions",
  RequestDefinedOptions = "RequestDefinedOptions",
}

export enum OptionSelectionType {
  SingleSelect = "SingleSelect",
  MultiSelect = "MultiSelect",
  Rank = "Rank",
}

export enum ResultType {
  RawResponseData = "RawResponseData",
  SingleOption = "SingleOption",
  SummarizeResponses = "SummraizeResponses",
}

export enum ResultDecisionType {
  PercentageVote = "PercentageVote",
  ThresholdVote = "ThresholdVote",
  RankChoiceVote = "RankChoiceVote",
}

export enum FreeInputResponseType {
  AiSummary = "AiSummary",
  ThresholdVote = "ThresholdVote",
  Normal = "Normal",
}

export enum ActionType {
  None = "None",
  CallWebhook = "CallWebhook",
  TriggerStep = "TriggerStep",
}

export enum ResultFreeText {
  AiSummary = "AiSummary",
  RawResponses = "RawResponses",
}

export interface PreviousStepResult {
  stepName: string;
  isAiSummary: boolean;
  stepType: string;
}
