import { ValueType } from "@/graphql/generated/graphql";

export const newInputTypes = [
  { name: "Text", value: ValueType.String },
  { name: "Number", value: ValueType.Float },
  { name: "Url", value: ValueType.Uri },
  { name: "Date Time", value: ValueType.DateTime },
  { name: "Date", value: ValueType.Date },
];

export const optionInputTypes = [
  ValueType.OptionSelections,
  ValueType.String,
  ValueType.Float,
  ValueType.Uri,
  ValueType.DateTime,
  ValueType.Date,
];

export const fieldInputTypes = [
  ValueType.OptionSelections,
  ValueType.String,
  ValueType.Float,
  ValueType.Uri,
  ValueType.DateTime,
  ValueType.Date,
];
