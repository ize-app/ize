import { Value } from "@/graphql/generated/resolver-types";

import { stringifyValue } from "./stringifyInput";

export interface FieldAndValues {
  field: string;
  value: Value | Value[];
}

export interface FieldsAndValues {
  title?: string;
  subtitle?: string;
  fieldsAndValues: FieldAndValues[];
}

interface StringifyFieldAndValuesProps extends FieldsAndValues {
  type: "html" | "markdown";
}

interface StringifyFieldAndValuesSet {
  fieldsAndValuesSet: FieldsAndValues[];
  setTitle?: string;
  type: "html" | "markdown";
}

export const stringifyFieldsAndValuesSet = ({
  setTitle,
  fieldsAndValuesSet,
  type,
}: StringifyFieldAndValuesSet): string => {
  const set = fieldsAndValuesSet
    .map((fieldAndValues) => stringifyFieldsAndValues({ ...fieldAndValues, type }))
    .join(`\n\n`);

  if (setTitle) return `${setTitle}\n\n${set}`;
  else return set;
};

export const stringifyFieldsAndValues = ({
  title,
  subtitle,
  fieldsAndValues,
  type,
}: StringifyFieldAndValuesProps): string => {
  const boldOpen = type === "html" ? "<strong>" : "**";
  const boldClose = type === "html" ? "</strong>" : "**";

  const fvString = fieldsAndValues
    .map((val) => {
      const value = val.value;

      if (Array.isArray(value)) {
        if (value.length === 0) {
          return `${boldOpen}${val.field}${boldClose}: -`;
        } else if (value.length === 1) {
          return `${boldOpen}${val.field}${boldClose}:\n${stringifyValue(value[0])}`;
        } else {
          return `${boldOpen}${val.field}${boldClose}:\n${value.map((v) => `- ${stringifyValue(v)}`).join(`\n`)}`;
        }
      } else {
        return `${boldOpen}${val.field}${boldClose}: ${stringifyValue(value)}`;
      }
    })
    .join(`\n`);

  if (title) {
    return `${boldOpen}${title}${boldClose}${subtitle ? `: ${subtitle}\n\n` : ""}${fvString}`;
  } else return fvString;
};
