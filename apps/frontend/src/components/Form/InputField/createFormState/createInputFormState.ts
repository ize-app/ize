import dayjs from "dayjs";

import {
  FieldFragment,
  OptionSelectionType,
  OptionsConfigFragment,
  ValueFragment,
  ValueType,
} from "@/graphql/generated/graphql";

import { InputSchemaType, OptionSelectionValueSchemaType } from "../inputValidation";

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
          value: { uri: value.uri, name: value.name ?? "" },
          type: ValueType.Uri,
          required,
        };
      // TODO I don't think I'm handling the types below correctly
      case "OptionSelectionsValue": {
        if (!optionsConfig) throw Error("Only fields can have option selections");

        const { maxSelections, selectionType } = optionsConfig;
        return {
          value: value.selections,
          type: ValueType.OptionSelections,
          required,
          maxSelections: maxSelections ?? null,
          selectionType: selectionType,
        };
      }
      // not currently used by FE. will need to revisit
      case "FlowVersionValue":
        return {
          value: {
            name: value.flowVersion.flowName,
            flowId: value.flowVersion.flowId,
            flowVersionId: value.flowVersion.flowVersionId,
          },
          type: ValueType.FlowVersion,
          required,
        };
      // not currently used by FE. will need to revisit
      case "FlowsValue":
        return {
          value: value.flows.map((flow) => ({
            name: flow.flowName,
            flowId: flow.flowId,
            flowVersionId: flow.flowVersionId,
          })),
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
        return { value: null, type: ValueType.Date, required };
      case ValueType.DateTime:
        return { value: null, type: ValueType.DateTime, required };
      case ValueType.Entities:
        return { value: [], type: ValueType.Entities, required };
      case ValueType.Flows:
        return { value: [], type: ValueType.Flows, required };
      case ValueType.Float:
        return { value: "", type: ValueType.Float, required };
      case ValueType.String:
        return { value: "", type: ValueType.String, required };
      case ValueType.Uri:
        return { value: { uri: "", name: "" }, type: ValueType.Uri, required };
      case ValueType.OptionSelections: {
        if (!optionsConfig) throw Error("Only fields can have option selections");
        const { selectionType, maxSelections } = optionsConfig;

        const value: OptionSelectionValueSchemaType[] =
          selectionType === OptionSelectionType.Rank
            ? optionsConfig?.options.map((option) => ({ optionId: option.optionId }))
            : [];
        return {
          value,
          type: ValueType.OptionSelections,
          required,
          selectionType,
          maxSelections: maxSelections ?? null,
        };
      }
      case ValueType.FlowVersion:
        // Flow version isn't supported as an input type, it's only used by backend
        throw Error("Flow version input should always have a value");
    }
  }

  throw Error("Error creating default input sate: Missing value type or value");
};
