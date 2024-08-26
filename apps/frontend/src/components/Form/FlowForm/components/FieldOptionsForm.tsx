import CloseIcon from "@mui/icons-material/Close";
import { Box, FormHelperText, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { UseFormReturn, useFieldArray } from "react-hook-form";

import { FieldDataType, FieldOptionsSelectionType, ResultType } from "@/graphql/generated/graphql";

import { DatePicker, DateTimePicker, Select, TextField } from "../../formFields";
import { SelectOption } from "../../formFields/Select";
import { ResponsiveFormRow } from "../../formLayout/ResponsiveFormRow";
import { getSelectOptionName } from "../../utils/getSelectOptionName";
import { FieldOptionSchemaType, OptionSelectionCountLimit } from "../formValidation/fields";
import { FlowSchemaType, StepSchemaType } from "../formValidation/flow";

const createLinkOptions = (steps: StepSchemaType[], currentStepIndex: number) => {
  const results: SelectOption[] = [];
  steps.forEach((s, stepIndex) => {
    // only include results from previous steps
    if (currentStepIndex <= stepIndex) return;
    s.result.forEach((r, resultIndex) => {
      results.push({
        name: `Include  result from "Step ${stepIndex + 1}, Result ${resultIndex + 1}: ${
          r.type as ResultType
        }" as options`,
        value: r.resultId,
      });
    });
  });
  return results;
};

const multiSelectOptions = [
  { name: "1 option", value: 1 },
  { name: "2 options", value: 2 },
  { name: "3 options", value: 3 },
  { name: "4 options", value: 4 },
  { name: "5 options", value: 5 },
  { name: "No limit", value: OptionSelectionCountLimit.None },
];

export const defaultOption = (fieldIndex: number, optionIndex: number): FieldOptionSchemaType => ({
  optionId: "new." + fieldIndex + "." + optionIndex,
  name: "",
  dataType: FieldDataType.String,
});

interface FieldOptionsFormProps {
  formMethods: UseFormReturn<FlowSchemaType>;
  formIndex: number; // react-hook-form name
  fieldIndex: number;
  branch: "request" | "response";
  locked: boolean;
}

export const FieldOptionsForm = ({
  formMethods,
  formIndex,
  branch,
  fieldIndex,
  locked,
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

  const steps = formMethods.getValues(`steps`);
  const possibleLinkOptions = createLinkOptions(steps, formIndex);

  const enableRequestCreatedOptions = () => {
    formMethods.setValue(
      `steps.${formIndex}.${branch}.fields.${fieldIndex}.optionsConfig.hasRequestOptions`,
      true,
    );
  };

  const disableRequestCreatedOptions = () => {
    formMethods.setValue(
      `steps.${formIndex}.${branch}.fields.${fieldIndex}.optionsConfig.hasRequestOptions`,
      false,
    );
  };

  const hasRequestDefinedOptions = formMethods.watch(
    `steps.${formIndex}.${branch}.fields.${fieldIndex}.optionsConfig.hasRequestOptions`,
  );

  const stepDefinedOptions =
    formMethods.getValues(
      `steps.${formIndex}.${branch}.fields.${fieldIndex}.optionsConfig.options`,
    ) ?? [];

  const linkedOptions =
    formMethods.getValues(
      `steps.${formIndex}.${branch}.fields.${fieldIndex}.optionsConfig.linkedResultOptions`,
    ) ?? [];

  const optionsError =
    formMethods.formState.errors?.steps?.[formIndex]?.[branch]?.fields?.[fieldIndex]?.message ?? "";

  const optionSelectionType = formMethods.getValues(
    `steps.${formIndex}.${branch}.fields.${fieldIndex}.optionsConfig.selectionType`,
  );

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
            // showLabel={false}
            label={`Option #${inputIndex + 1}`}
            disabled={disabled}
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
            disabled={disabled}
          />
        );
      default:
        return (
          <TextField<FlowSchemaType>
            name={`steps.${formIndex}.${branch}.fields.${fieldIndex}.optionsConfig.options.${inputIndex}.name`}
            key={"name" + inputIndex.toString() + formIndex.toString()}
            control={control}
            defaultValue=""
            placeholderText={`Option #${inputIndex + 1}`}
            showLabel={false}
            multiline
            // sx={{ flexGrow: 1 }}
            label={`Option #${inputIndex + 1}`}
            disabled={disabled}
            size="small"
          />
        );
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        flexGrow: 1,
      }}
    >
      <Box sx={{ display: "none" }}>
        {" "}
        <TextField<FlowSchemaType>
          name={`steps.${formIndex}.${branch}.fields.${fieldIndex}.optionsConfig.hasRequestOptions`}
          key={"hasRequestOptions" + formIndex.toString()}
          defaultValue=""
          control={control}
          showLabel={false}
          label={`Has request options - ignore`}
          disabled={true}
          size="small"
        />
        <TextField<FlowSchemaType>
          name={`steps.${formIndex}.${branch}.fields.${fieldIndex}.optionsConfig.linkedResultOptions`}
          key={"linkedOptions" + formIndex.toString()}
          defaultValue=""
          control={control}
          showLabel={false}
          label={`Linked options - ignore`}
          disabled={true}
          size="small"
        />
        <TextField<FlowSchemaType>
          name={`steps.${formIndex}.${branch}.fields.${fieldIndex}.optionsConfig.requestOptionsDataType`}
          key={"requestOptionsDataType" + formIndex.toString()}
          control={control}
          showLabel={false}
          defaultValue=""
          label={`Linked options - ignore`}
          disabled={true}
          size="small"
        />
      </Box>
      {optionSelectionType === FieldOptionsSelectionType.MultiSelect && (
        <Select<FlowSchemaType>
          control={formMethods.control}
          defaultValue=""
          display={optionSelectionType === FieldOptionsSelectionType.MultiSelect}
          label="How many options can be selected?"
          renderValue={(val) => {
            const option = multiSelectOptions.find((option) => option.value === val);
            return "User can select " + option?.name + " maximum";
          }}
          selectOptions={multiSelectOptions}
          name={`steps.${formIndex}.${branch}.fields.${fieldIndex}.optionsConfig.maxSelections`}
          size={"small"}
        />
      )}
      <Typography variant={"label2"}>Available options</Typography>
      {stepDefinedOptions.length > 0 &&
        fields.map((item, inputIndex) => {
          return (
            <Box
              key={item.id}
              sx={{
                display: "flex",
                flexDirection: "row",
                flexGrow: 1,
              }}
            >
              <ResponsiveFormRow key={item.id}>
                <Box sx={{ display: "none" }}>
                  <TextField<FlowSchemaType>
                    name={`steps.${formIndex}.${branch}.fields.${fieldIndex}.optionsConfig.options.${inputIndex}.optionId`}
                    key={"optionId" + inputIndex.toString() + formIndex.toString()}
                    control={control}
                    showLabel={false}
                    label={`Option ID - ignore`}
                    disabled={true}
                    size="small"
                    defaultValue=""
                  />
                </Box>
                <Select<FlowSchemaType>
                  control={control}
                  disabled={locked}
                  size={"small"}
                  sx={{ flexBasis: "100px", flexGrow: 1 }}
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
                  defaultValue=""
                />

                {renderInput(inputIndex, locked)}
              </ResponsiveFormRow>

              {!locked && (
                <IconButton
                  color="primary"
                  aria-label="Remove option"
                  onClick={() => remove(inputIndex)}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          );
        })}
      {linkedOptions.length > 0 && possibleLinkOptions.length > 0 && (
        <Box sx={{ width: "100%" }}>
          {linksFields.map((item, inputIndex) => {
            return (
              <Box key={item.id} sx={{ display: "flex", flexDirection: "row", width: "100%" }}>
                <Select<FlowSchemaType>
                  control={control}
                  sx={{}}
                  size={"small"}
                  name={`steps.${formIndex}.${branch}.fields.${fieldIndex}.optionsConfig.linkedResultOptions.${inputIndex}.id`}
                  key={"links" + inputIndex.toString() + formIndex.toString()}
                  selectOptions={possibleLinkOptions}
                  renderValue={(val) => {
                    if (val) return getSelectOptionName(possibleLinkOptions, val);
                    else return "Select a previous result";
                  }}
                  label="Type"
                  displayEmpty={true}
                  defaultValue=""
                />
                <IconButton
                  color="primary"
                  aria-label="Remove linked options"
                  onClick={() => linksRemove(inputIndex)}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            );
          })}
        </Box>
      )}
      {hasRequestDefinedOptions && branch === "response" && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            flexGrow: 1,
          }}
        >
          <ResponsiveFormRow sx={{ justifyContent: "space-between" }}>
            {" "}
            <Typography>Options created at trigger</Typography>
            <Box>
              <Select
                control={formMethods.control}
                name={`steps.${formIndex}.${branch}.fields.${fieldIndex}.optionsConfig.requestOptionsDataType`}
                defaultValue=""
                selectOptions={[
                  { name: "Text", value: FieldDataType.String },
                  { name: "Number", value: FieldDataType.Number },
                  { name: "Uri", value: FieldDataType.Uri },
                  { name: "Date", value: FieldDataType.Date },
                  { name: "DateTime", value: FieldDataType.DateTime },
                ]}
                label="Option type"
                size="small"
                sx={{ width: "100px", flexGrow: 0 }}
                variant="standard"
              />
            </Box>
          </ResponsiveFormRow>
          <IconButton
            color="primary"
            aria-label="Remove request created options"
            onClick={disableRequestCreatedOptions}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      )}
      {!locked && (
        <ResponsiveFormRow>
          <Button
            sx={{ position: "relative" }}
            variant="outlined"
            size="small"
            onClick={() => {
              append(defaultOption(fieldIndex, stepDefinedOptions.length));
            }}
          >
            Add option
          </Button>
          {possibleLinkOptions.length > 0 && branch === "response" && (
            <Button
              sx={{ position: "relative" }}
              variant="text"
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
              sx={{ position: "relative" }}
              variant="text"
              size="small"
              onClick={enableRequestCreatedOptions}
            >
              Allow options to be created at trigger
            </Button>
          )}
        </ResponsiveFormRow>
      )}

      <FormHelperText
        sx={{
          color: "error.main",
          marginLeft: "16px",
        }}
      >
        {optionsError}
      </FormHelperText>
    </Box>
  );
};
