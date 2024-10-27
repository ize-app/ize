import HighlightOffOutlined from "@mui/icons-material/HighlightOffOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useFieldArray, useFormContext } from "react-hook-form";

import { FieldOption } from "@/components/Field/FieldOption";
import { FieldOptionsContainer } from "@/components/Field/FieldOptionsContainer";
import { InputField } from "@/components/Form/FlowForm/components/InputField";
import { FieldDataType, FieldType, Flow, OptionsFragment } from "@/graphql/generated/graphql";

import { TextField } from "../../../components/Form/formFields";
import { RequestDefinedOptionSchemaType, RequestSchemaType } from "../formValidation";

export const RequestDefinedOptionsForm = ({ flow }: { flow: Flow }) => {
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
  const requestDefinedOptionsFormMethods = useFieldArray({
    control: control,
    name: `requestDefinedOptions.${field.fieldId}`,
  });

  const defaultOption: RequestDefinedOptionSchemaType = {
    dataType: field.requestOptionsDataType as FieldDataType,
    name: "",
  };
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Typography color="primary" fontWeight={500} sx={{ marginBottom: "6px" }}>
        {field.name}
      </Typography>

      {/* Existing options defined on the workflow */}
      <FieldOptionsContainer>
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
              <TextField<RequestSchemaType>
                name={`requestDefinedOptions.${field.fieldId}.${inputIndex}.dataType`}
                key={"dataType" + inputIndex.toString()}
                showLabel={false}
                label={`Option ID - ignore`}
                variant="standard"
                display={false}
                disabled={true}
                size="small"
              />

              <InputField
                fieldName={`requestDefinedOptions.${field.fieldId}.${inputIndex}.name`}
                label={`Option #${inputIndex + 1}`}
                dataType={item.dataType}
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
              requestDefinedOptionsFormMethods.append(defaultOption);
            }}
          >
            Add option
          </Button>
        )}
      </FieldOptionsContainer>
    </Box>
  );
};
