// TODO: convert all of these into graphql types

export enum RequestTriggerType {
  Agents = "Agents",
  Anyone = "Anyone",
  Process = "Process",
}

export enum RespondTriggerType {
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
  FreeText = "FreeText",
  SelectOption = "SelectOption",
  RankedChoice = "RankedChoice",
}

export enum FreeTextDataType {
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

export enum FreeTextResponseType {
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
