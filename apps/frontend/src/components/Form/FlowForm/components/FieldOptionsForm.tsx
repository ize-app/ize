import HighlightOffOutlined from "@mui/icons-material/HighlightOffOutlined";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { FlowSchemaType, StepSchemaType } from "../formValidation/flow";
import { UseFormReturn, useFieldArray } from "react-hook-form";

import { DatePicker, DateTimePicker, Select, TextField } from "../../formFields";

import { FieldOptionSchemaType } from "../formValidation/fields";
import { FieldDataType } from "@/graphql/generated/graphql";
import { ResponsiveFormRow } from "../../formLayout/ResponsiveFormRow";
import { Box, FormHelperText, Typography } from "@mui/material";
import { SelectOption } from "../../formFields/Select";
import { getSelectOptionName } from "../../utils/getSelectOptionName";

const createLinkOptions = (steps: StepSchemaType[], currentStepIndex: number) => {
  const results: SelectOption[] = [];
  steps.forEach((s, stepIndex) => {
    // only include results from previous steps
    if (currentStepIndex <= stepIndex) return;
    s.result.forEach((r, resultIndex) => {
      results.push({
        name: `Include  result from "Step ${stepIndex + 1}, Result ${resultIndex + 1}: ${
          r.type
        }" as options`,
        value: r.resultId,
      });
    });
  });
  return results;
};

export const defaultOption = (index: number): FieldOptionSchemaType => ({
  optionId: "new." + index,
  name: "",
  dataType: FieldDataType.String,
});

interface FieldOptionsFormProps {
  formMethods: UseFormReturn<FlowSchemaType>;
  formIndex: number; // react-hook-form name
  fieldIndex: number;
  branch: "request" | "response";
}

export const FieldOptionsForm = ({
  formMethods,
  formIndex,
  branch,
  fieldIndex,
}: FieldOptionsFormProps) => {
  const { control } = formMethods;

  const { fields, remove, append } = useFieldArray({
    control: formMethods.control,
    name: `steps.${formIndex}.${branch}.fields.${fieldIndex}.optionsConfig.options`,
  });

  const {
    fields: linksFields,
    remove: linksRemove,
    append: linksAppend,
  } = useFieldArray({
    control: formMethods.control,
    name: `steps.${formIndex}.${branch}.fields.${fieldIndex}.optionsConfig.linkedResultOptions`,
  });

  const steps = formMethods.watch(`steps`);
  const possibleLinkOptions = createLinkOptions(steps, formIndex);

  const enableRequestCreatedOptions = (_event: React.MouseEvent<HTMLElement>) => {
    formMethods.setValue(
      `steps.${formIndex}.${branch}.fields.${fieldIndex}.optionsConfig.hasRequestOptions`,
      true,
    );
  };

  const disableRequestCreatedOptions = (_event: React.MouseEvent<HTMLElement>) => {
    formMethods.setValue(
      `steps.${formIndex}.${branch}.fields.${fieldIndex}.optionsConfig.hasRequestOptions`,
      false,
    );
  };

  const hasRequestDefinedOptions = formMethods.watch(
    `steps.${formIndex}.${branch}.fields.${fieldIndex}.optionsConfig.hasRequestOptions`,
  );

  console.log("request requeted options is", hasRequestDefinedOptions);
  const stepDefinedOptions =
    formMethods.watch(`steps.${formIndex}.${branch}.fields.${fieldIndex}.optionsConfig.options`) ??
    [];

  const linkedOptions =
    formMethods.watch(
      `steps.${formIndex}.${branch}.fields.${fieldIndex}.optionsConfig.linkedResultOptions`,
    ) ?? [];

  const optionsError =
    formMethods.getFieldState(`steps.${formIndex}.${branch}.fields.${fieldIndex}`).error?.message ??
    "";

  const renderInput = (inputIndex: number, disabled: boolean) => {
    const dataType = formMethods.getValues(
      `steps.${formIndex}.${branch}.fields.${fieldIndex}.optionsConfig.options.${inputIndex}.dataType`,
    );

    switch (dataType) {
      case FieldDataType.Date:
        return (
          <DatePicker<FlowSchemaType>
            name={`steps.${formIndex}.${branch}.fields.${fieldIndex}.optionsConfig.options.${inputIndex}.name`}
            key={"name" + inputIndex.toString() + formIndex.toString()}
            control={control}
            showLabel={false}
            label={`Option #${inputIndex + 1}`}
          />
        );
      case FieldDataType.DateTime:
        return (
          <DateTimePicker<FlowSchemaType>
            name={`steps.${formIndex}.${branch}.fields.${fieldIndex}.optionsConfig.options.${inputIndex}.name`}
            key={"name" + inputIndex.toString() + formIndex.toString()}
            control={control}
            showLabel={false}
            label={`Option #${inputIndex + 1}`}
          />
        );
      default:
        return (
          <TextField<FlowSchemaType>
            name={`steps.${formIndex}.${branch}.fields.${fieldIndex}.optionsConfig.options.${inputIndex}.name`}
            key={"name" + inputIndex.toString() + formIndex.toString()}
            control={control}
            placeholderText={`Option #${inputIndex + 1}`}
            showLabel={false}
            multiline
            width="300px"
            flexGrow="1"
            label={`Option #${inputIndex + 1}`}
            disabled={disabled}
            size="small"
            variant="standard"
          />
        );
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          alignItems: "flex-start",
          padding: "12px",
          width: "100%",
        }}
      >
        <Box sx={{ display: "none" }}>
          {" "}
          <TextField<FlowSchemaType>
            name={`steps.${formIndex}.${branch}.fields.${fieldIndex}.optionsConfig.hasRequestOptions`}
            key={"hasRequestOptions" + formIndex.toString()}
            control={control}
            showLabel={false}
            label={`Has request options - ignore`}
            variant="standard"
            disabled={true}
            size="small"
          />
          <TextField<FlowSchemaType>
            name={`steps.${formIndex}.${branch}.fields.${fieldIndex}.optionsConfig.linkedResultOptions`}
            key={"linkedOptions" + formIndex.toString()}
            control={control}
            showLabel={false}
            label={`Linked options - ignore`}
            variant="standard"
            disabled={true}
            size="small"
          />
          <TextField<FlowSchemaType>
            name={`steps.${formIndex}.${branch}.fields.${fieldIndex}.optionsConfig.requestOptionsDataType`}
            key={"requestOptionsDataType" + formIndex.toString()}
            control={control}
            showLabel={false}
            label={`Linked options - ignore`}
            variant="standard"
            disabled={true}
            size="small"
          />
        </Box>
        {stepDefinedOptions.length > 0 && (
          <Box sx={{ width: "100%" }}>
            {fields.map((item, inputIndex) => {
              return (
                <ResponsiveFormRow key={item.id}>
                  <Box sx={{ display: "none" }}>
                    <TextField<FlowSchemaType>
                      name={`steps.${formIndex}.${branch}.fields.${fieldIndex}.optionsConfig.options.${inputIndex}.optionId`}
                      key={"optionId" + inputIndex.toString() + formIndex.toString()}
                      control={control}
                      showLabel={false}
                      label={`Option ID - ignore`}
                      variant="standard"
                      disabled={true}
                      size="small"
                    />
                  </Box>
                  <Select<FlowSchemaType>
                    control={control}
                    width="120px"
                    displayLabel={false}
                    size={"small"}
                    //@ts-ignore
                    name={`steps.${formIndex}.${branch}.fields.${fieldIndex}.optionsConfig.options.${inputIndex}.dataType`}
                    key={"dataType" + inputIndex.toString() + formIndex.toString()}
                    selectOptions={[
                      { name: "Text", value: FieldDataType.String },
                      { name: "Number", value: FieldDataType.Number },
                      { name: "Url", value: FieldDataType.Uri },
                      { name: "Date Time", value: FieldDataType.DateTime },
                      { name: "Date", value: FieldDataType.Date },
                    ]}
                    label="Type"
                    variant="standard"
                  />

                  {renderInput(inputIndex, false)}
                  <IconButton
                    color="primary"
                    aria-label="Remove option"
                    onClick={() => remove(inputIndex)}
                  >
                    <HighlightOffOutlined />
                  </IconButton>
                </ResponsiveFormRow>
              );
            })}
          </Box>
        )}
        {linkedOptions.length > 0 && possibleLinkOptions.length > 0 && (
          <Box sx={{ width: "100%" }}>
            {linksFields.map((item, inputIndex) => {
              return (
                <ResponsiveFormRow key={item.id}>
                  <Select<FlowSchemaType>
                    control={control}
                    width="120px"
                    displayLabel={false}
                    size={"small"}
                    // variant="outlined"
                    flexGrow="1"
                    name={`steps.${formIndex}.${branch}.fields.${fieldIndex}.optionsConfig.linkedResultOptions.${inputIndex}.id`}
                    key={"links" + inputIndex.toString() + formIndex.toString()}
                    selectOptions={possibleLinkOptions}
                    renderValue={(val) => {
                      if (val) return getSelectOptionName(possibleLinkOptions, val);
                      else return "Select a return value";
                    }}
                    label="Type"
                    variant="standard"
                    displayEmpty={true}
                  />
                  <IconButton
                    color="primary"
                    aria-label="Remove linked options"
                    onClick={() => linksRemove(inputIndex)}
                  >
                    <HighlightOffOutlined />
                  </IconButton>
                </ResponsiveFormRow>
              );
            })}
          </Box>
        )}
        {hasRequestDefinedOptions && branch === "response" && (
          <ResponsiveFormRow>
            <Typography sx={{ flexGrow: 1 }}>Requestor can add options</Typography>
            <Select
              control={formMethods.control}
              width="150px"
              //@ts-ignore
              name={`steps.${formIndex}.${branch}.fields.${fieldIndex}.optionsConfig.requestOptionsDataType`}
              selectOptions={[
                { name: "Text", value: FieldDataType.String },
                { name: "Number", value: FieldDataType.Number },
                { name: "Uri", value: FieldDataType.Uri },
                { name: "Date", value: FieldDataType.Date },
                { name: "DateTime", value: FieldDataType.DateTime },
              ]}
              label="Option type"
              size="small"
              variant="standard"
              displayLabel={false}
            />
            <IconButton
              color="primary"
              aria-label="Remove request created options"
              onClick={disableRequestCreatedOptions}
            >
              <HighlightOffOutlined />
            </IconButton>
          </ResponsiveFormRow>
        )}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Button
            sx={{ position: "relative", width: "250px" }}
            variant="outlined"
            size="small"
            onClick={() => {
              append(defaultOption(stepDefinedOptions.length));
            }}
          >
            Add option
          </Button>
          {possibleLinkOptions.length > 0 && branch === "response" && (
            <Button
              sx={{ position: "relative", width: "250px" }}
              variant="outlined"
              size="small"
              onClick={() => {
                linksAppend({ id: "" });
              }}
            >
              Use previous result as option(s)
            </Button>
          )}
          {!hasRequestDefinedOptions && formIndex === 0 && branch === "response" && (
            <Button
              sx={{ position: "relative", width: "250px" }}
              variant="outlined"
              size="small"
              onClick={enableRequestCreatedOptions}
            >
              Allow requestor to add options
            </Button>
          )}
        </Box>

        <FormHelperText
          sx={{
            color: "error.main",
            marginLeft: "16px",
          }}
        >
          {optionsError}
        </FormHelperText>
      </Box>
    </Box>
  );
};
