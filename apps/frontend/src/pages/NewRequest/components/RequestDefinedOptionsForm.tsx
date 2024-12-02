import HighlightOffOutlined from "@mui/icons-material/HighlightOffOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useFieldArray, useFormContext } from "react-hook-form";

import { FieldOption } from "@/components/Field/FieldOption";
import { createDefaultOptionState } from "@/components/Form/FlowForm/helpers/defaultFormState/createDefaultOptionState";
import { InputField } from "@/components/Form/InputField/InputField";
import { stringifyValueType } from "@/components/Value/stringifyValueType";
import { FieldFragment, FlowFragment, ValueType } from "@/graphql/generated/graphql";

import { RequestSchemaType } from "../requestValidation";

export const RequestDefinedOptionsForm = ({ flow }: { flow: FlowFragment }) => {
  const fields: FieldFragment[] = [];

  flow.steps.forEach((step) => {
    step.fieldSet.fields.forEach((field) => {
      if (field.type === ValueType.OptionSelections && field.optionsConfig?.triggerOptionsType) {
        fields.push(field);
      }
    });
  });

  if (fields.length === 0) return;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "18px",
        marginBottom: "24px",
        padding: "20px",
        outline: "1px solid rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography variant="description">
        Add possible options for questions that respondants will answer during this flow
      </Typography>
      {fields.map((field) => {
        return <RequestDefinedOptionsFieldForm key={field.fieldId} field={field} />;
      })}
    </Box>
  );
};

export const RequestDefinedOptionsFieldForm = ({ field }: { field: FieldFragment }) => {
  const { control } = useFormContext<RequestSchemaType>();
  const requestDefinedOptionsArrayMethods = useFieldArray<
    RequestSchemaType,
    `requestDefinedOptions.${string}`,
    "id"
  >({
    control: control,
    name: `requestDefinedOptions.${field.fieldId}`,
  });

  const optionsConfig = field.optionsConfig;
  if (!optionsConfig) return;
  const type = optionsConfig.triggerOptionsType;
  if (!type) return;

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Typography color="primary" fontWeight={500} sx={{ marginBottom: "6px" }}>
        {field.name}
      </Typography>

      {/* Existing options defined on the workflow */}
      <Box
        sx={{
          borderRadius: "4px",
          border: "1px solid rgba(0, 0, 0, 0.1)",
          backgroundColor: "white",
          padding: "6px",
        }}
      >
        {!!field.optionsConfig &&
          field.optionsConfig.options.map((option, index) => {
            return (
              <FieldOption
                isSelected={false}
                key={option.optionId}
                value={option.value}
                final={true}
                selectionType={optionsConfig.selectionType}
                index={index}
              />
            );
          })}
        {requestDefinedOptionsArrayMethods.fields.map((item, inputIndex) => {
          return (
            <Box key={item.id} sx={{ display: "flex", marginLeft: "8px" }}>
              <InputField<RequestSchemaType>
                type="newOption"
                fieldName={`requestDefinedOptions.${field.fieldId}.${inputIndex}.input.value`}
                label={`Option #${inputIndex + 1} (${stringifyValueType(type)})`}
                option={item}
                key={field.fieldId}
                showLabel={false}
                seperateLabel={false}
              />
              <IconButton
                color="primary"
                aria-label="Remove option"
                onClick={() => requestDefinedOptionsArrayMethods.remove(inputIndex)}
              >
                <HighlightOffOutlined />
              </IconButton>
            </Box>
          );
        })}
        {
          <Button
            sx={{ position: "relative", margin: "8px 0px 8px 8px" }}
            variant="outlined"
            size={"small"}
            onClick={() => {
              requestDefinedOptionsArrayMethods.append(createDefaultOptionState({ type }));
            }}
          >
            Add option
          </Button>
        }
      </Box>
    </Box>
  );
};
