import { ValueType } from "@/graphql/generated/graphql";

import { SelectOption } from "../../formFields/Select";

export const defaultFreeInputDefaultOptions: SelectOption[] = [
  { name: "Text", value: ValueType.String },
  { name: "Number", value: ValueType.Float },
  { name: "Url", value: ValueType.Uri },
  { name: "Date Time", value: ValueType.DateTime },
  { name: "Date", value: ValueType.Date },
];
