import { FieldDataType } from "@/graphql/generated/graphql";

import { SelectOption } from "../../formFields/Select";

export const defaultFreeInputDefaultOptions: SelectOption[] = [
  { name: "Text", value: FieldDataType.String },
  { name: "Number", value: FieldDataType.Number },
  { name: "Url", value: FieldDataType.Uri },
  { name: "Date Time", value: FieldDataType.DateTime },
  { name: "Date", value: FieldDataType.Date },
];
