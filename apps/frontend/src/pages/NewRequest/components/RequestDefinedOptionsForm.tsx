import HighlightOffOutlined from "@mui/icons-material/HighlightOffOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useFieldArray, useFormContext } from "react-hook-form";

import { FieldOption } from "@/components/Field/FieldOption";
import { formatDataTypeName } from "@/components/Field/formatDataTypeName";
import { createDefaultOptionState } from "@/components/Form/FlowForm/helpers/defaultFormState/createDefaultOptionState";
import { InputField } from "@/components/Form/InputField/InputField";
import {
  FieldDataType,
  FieldType,
  FlowFragment,
  OptionsFragment,
} from "@/graphql/generated/graphql";

import { RequestSchemaType } from "../requestValidation";

export const RequestDefinedOptionsForm = ({ flow }: { flow: FlowFragment }) => {
  const fields: OptionsFragment[] = [];

  flow.steps.forEach((step) => {
    step.fieldSet.fields.forEach((field) => {
      if (field.__typename === FieldType.Options && field.requestOptionsDataType) {
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

export const RequestDefinedOptionsFieldForm = ({ field }: { field: OptionsFragment }) => {
  const { control } = useFormContext<RequestSchemaType>();
  const requestDefinedOptionsFormMethods = useFieldArray<
    RequestSchemaType,
    `requestDefinedOptions.${string}`,
    "id"
  >({
    control: control,
    name: `requestDefinedOptions.${field.fieldId}`,
  });

  //@ts-expect-error Typechecking broken here, not sure why
  const dataType: FieldDataType = field.requestOptionsDataType;

  if (!dataType) return;

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
        {field.options.map((option, index) => {
          return (
            <FieldOption
              isSelected={false}
              key={option.optionId}
              value={option.name}
              final={true}
              dataType={option.dataType}
              selectionType={field.selectionType}
              index={index}
            />
          );
        })}
        {requestDefinedOptionsFormMethods.fields.map((item, inputIndex) => {
          return (
            <Box key={item.id} sx={{ display: "flex", marginLeft: "8px" }}>
              <InputField<RequestSchemaType>
                fieldName={`requestDefinedOptions.${field.fieldId}.${inputIndex}.input.value`}
                label={`Option #${inputIndex + 1} (${formatDataTypeName(dataType)})`}
                dataType={dataType}
                key={field.fieldId}
                type={FieldType.FreeInput}
                showLabel={false}
                seperateLabel={false}
              />
              <IconButton
                color="primary"
                aria-label="Remove option"
                onClick={() => requestDefinedOptionsFormMethods.remove(inputIndex)}
              >
                <HighlightOffOutlined />
              </IconButton>
            </Box>
          );
        })}
        {field.requestOptionsDataType && (
          <Button
            sx={{ position: "relative", margin: "8px 0px 8px 8px" }}
            variant="outlined"
            size={"small"}
            onClick={() => {
              requestDefinedOptionsFormMethods.append(createDefaultOptionState({ dataType }));
            }}
          >
            Add option
          </Button>
        )}
      </Box>
    </Box>
  );
};
