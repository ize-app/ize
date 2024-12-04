import dayjs from "dayjs";

import {
  FieldFragment,
  OptionsConfigFragment,
  ValueFragment,
  ValueType,
} from "@/graphql/generated/graphql";

import { InputSchemaType } from "../inputValidation";

// take raw data from the server and convert it to the form state
// used currently for evolving the flow form

interface NewOptionValueFormStateProps {
  type: "newOption";
  valueType: ValueType;
}

interface OptionValueFormStateProps {
  type: "optionValue";
  valueType: ValueType;
  value: ValueFragment;
}

interface FieldValueFormStateProps {
  type: "field";
  field: FieldFragment;
  value?: ValueFragment;
}

type ValueFormStateProps =
  | NewOptionValueFormStateProps
  | OptionValueFormStateProps
  | FieldValueFormStateProps;

// if field, use field required and field optionConfig

// option use

export const createInputValueFormState = ({ ...args }: ValueFormStateProps): InputSchemaType => {
  let value: ValueFragment | undefined = undefined;
  let required: boolean = true;
  let type: ValueType | undefined = undefined;
  let optionsConfig: OptionsConfigFragment | null = null;

  if (args.type === "newOption") {
    type = args.valueType;
    required = true;
  } else if (args.type === "optionValue") {
    value = args.value;
    required = true;
  } else {
    value = args.value;
    type = args.field.type;
    optionsConfig = args.field.optionsConfig ?? null;
    required = args.field.required;
  }

  if (value) {
    switch (value.__typename) {
      case "StringValue":
        return { value: value.value, type: ValueType.String, required };
      case "FloatValue":
        return { value: value.float, type: ValueType.Float, required };
      case "DateTimeValue":
        return {
          value: dayjs.utc(value.dateTime),
          type: ValueType.DateTime,
          required,
        };
      case "DateValue":
        return {
          // all pure date values are handled with UTC
          value: dayjs.utc(value.date).startOf("day"),
          type: ValueType.Date,
          required,
        };
      case "UriValue":
        return {
          value: value.uri,
          type: ValueType.Uri,
          required,
        };
      // TODO I don't think I'm handling the types below correctly
      case "OptionSelectionsValue":
        return {
          value: value.selections,
          type: ValueType.OptionSelections,
          required,
          maxSelections: optionsConfig?.maxSelections,
          selectionType: optionsConfig?.selectionType,
        };
      case "FlowVersionValue":
        return {
          value: value.flowVersion,
          type: ValueType.FlowVersion,
          required,
        };
      case "FlowsValue":
        return {
          value: value.flows,
          type: ValueType.Flows,
          required,
        };
      case "EntitiesValue":
        // TOOO come back to this. maybe simplify the schema

        return {
          //@ts-expect-error To fix this
          value: value.entities,
          type: ValueType.Entities,
          required,
        };
    }
  } else {
    switch (type) {
      case ValueType.Date:
        // all pure date values are handled with UTC
        return { value: dayjs().utc().startOf("day"), type: ValueType.Date, required };
      case ValueType.DateTime:
        return { value: dayjs(), type: ValueType.DateTime, required };
      case ValueType.Entities:
        return { value: [], type: ValueType.Entities, required };
      case ValueType.Flows:
        return { value: [], type: ValueType.Flows, required };
      case ValueType.Float:
        return { value: 1, type: ValueType.Float, required };
      case ValueType.String:
        return { value: "", type: ValueType.String, required };
      case ValueType.Uri:
        return { value: "", type: ValueType.Uri, required };
      case ValueType.OptionSelections:
        return { value: [], type: ValueType.OptionSelections, required };
      case ValueType.FlowVersion:
        // Flow version isn't supported as an input type, it's only used by backend
        throw Error("Flow version input should always have a value");
    }
  }

  throw Error("Error creating default input sate: Missing value type or value");
};
