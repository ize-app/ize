// TODO: convert all of these into graphql types

export enum RequestPermissionType {
  Agents = "Agents",
  Anyone = "Anyone",
  Process = "Process",
}

export enum RespondPermissionType {
  Agents = "Agents",
  Anyone = "Anyone",
}

export enum ResponseInputs {
  Agents = "Agents",
  Anyone = "Anyone",
}

export enum RequestInputDataType {
  String = "String",
  Number = "Number",
  Uri = "Uri",
  Date = "Date",
  DateTime = "DateTime",
}

export enum RespondInputType {
  FreeInput = "FreeInput",
  SelectOption = "SelectOption",
  RankOptions = "RankOptions",
  GroupOptions = "GroupOptions",
}

export enum ResponseDataType {
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

export enum ResultType {
  RawResponseData = "RawResponseData",
  SingleOption = "SingleOption",
  SummarizeResponses = "SummraizeResponses",
}

export enum ResultSingleOptionType {
  PercentageVote = "PercentageVote",
  ThresholdVote = "ThresholdVote",
  OptimisticVote = "OptimisticVote",
  RankChoiceVote = "RankChoiceVote",
}

export enum FreeInputResponseType {
  AiSummary = "AiSummary",
  ThresholdVote = "ThresholdVote",
  Normal = "Normal",
}

export enum ResultSummaryType {
  AiTextSummary = "AiTextSummary",
  WeightedRanking = "WeightedRanking",
  NumericalAverage = "NumericalAverage",
  NumericalSum = "NumericalSum",
}

export enum ActionType {
  None = "None",
  CallWebhook = "CallWebhook",
  TriggerProcess = "TriggerProcess",
}
