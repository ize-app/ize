import CloseIcon from "@mui/icons-material/Close";
import { Box, FormHelperText, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

import { FieldDataType, FieldOptionsSelectionType } from "@/graphql/generated/graphql";

import { Select } from "../../../formFields";
import { SelectOption } from "../../../formFields/Select";
import { ResponsiveFormRow } from "../../../formLayout/ResponsiveFormRow";
import { getSelectOptionName } from "../../../utils/getSelectOptionName";
import { OptionSelectionCountLimit } from "../../formValidation/fields";
import { FlowSchemaType, StepSchemaType } from "../../formValidation/flow";
import { createDefaultOptionState } from "../../helpers/defaultFormState/createDefaultOptionState";
import { UsePresetOptionsForm } from "../UsePresetOptionsForm";

const createLinkOptions = (steps: StepSchemaType[], currentStepIndex: number) => {
  const results: SelectOption[] = [];
  steps.forEach((s, stepIndex) => {
    // only include results from previous steps
    if (currentStepIndex <= stepIndex) return;
    s.result.forEach((r) => {
      const field = (s.fieldSet?.fields ?? []).find((f) => f.fieldId === r.fieldId);

      results.push({
        name: `${r.type} from step ${stepIndex + 1}${field?.name ? `: "${field.name}"` : ""}`,
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

interface ResponseFieldOptionsFormProps {
  stepIndex: number;
  fieldIndex: number;
  locked: boolean;
  reusable: boolean;
}

export const ResponseFieldOptionsForm = ({
  stepIndex,
  fieldIndex,
  locked,
  reusable,
}: ResponseFieldOptionsFormProps) => {
  const { control, getValues, setValue, watch, formState } = useFormContext<FlowSchemaType>();

  const { PresetOptions, append } = UsePresetOptionsForm<FlowSchemaType>({
    locked,
    fieldsArrayName: `steps.${stepIndex}.fieldSet.fields.${fieldIndex}.optionsConfig.options`,
  });

  const {
    fields: linksFields,
    remove: linksRemove,
    append: linksAppend,
  } = useFieldArray({
    control,
    name: `steps.${stepIndex}.fieldSet.fields.${fieldIndex}.optionsConfig.linkedResultOptions`,
  });

  const steps = getValues(`steps`);

  const possibleLinkOptions = createLinkOptions(steps, stepIndex);

  // remove linked option if that result is removed
  useEffect(() => {
    const linkedOptions = getValues(
      `steps.${stepIndex}.fieldSet.fields.${fieldIndex}.optionsConfig.linkedResultOptions`,
    );

    linkedOptions.forEach((result, index) => {
      if (!possibleLinkOptions.find((option) => option.value === result.id)) {
        linksRemove(index);
      }
    });
  }, [possibleLinkOptions]);

  const enableRequestCreatedOptions = () => {
    setValue(
      `steps.${stepIndex}.fieldSet.fields.${fieldIndex}.optionsConfig.requestOptionsDataType`,
      FieldDataType.String,
    );
  };

  const disableRequestCreatedOptions = () => {
    setValue(
      `steps.${stepIndex}.fieldSet.fields.${fieldIndex}.optionsConfig.requestOptionsDataType`,
      null,
    );
  };

  const hasRequestDefinedOptions = watch(
    `steps.${stepIndex}.fieldSet.fields.${fieldIndex}.optionsConfig.requestOptionsDataType`,
  );

  const linkedOptions =
    getValues(
      `steps.${stepIndex}.fieldSet.fields.${fieldIndex}.optionsConfig.linkedResultOptions`,
    ) ?? [];

  const optionsError =
    formState.errors?.steps?.[stepIndex]?.fieldSet?.fields?.[fieldIndex]?.message ?? "";

  const optionSelectionType = watch(
    `steps.${stepIndex}.fieldSet.fields.${fieldIndex}.optionsConfig.selectionType`,
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        flexGrow: 1,
      }}
    >
      {optionSelectionType === FieldOptionsSelectionType.MultiSelect && (
        <Select<FlowSchemaType>
          defaultValue=""
          display={optionSelectionType === FieldOptionsSelectionType.MultiSelect}
          label="How many options can be selected?"
          renderValue={(val) => {
            const option = multiSelectOptions.find((option) => option.value === val);
            return "User can select " + option?.name + " maximum";
          }}
          selectOptions={multiSelectOptions}
          name={`steps.${stepIndex}.fieldSet.fields.${fieldIndex}.optionsConfig.maxSelections`}
          size={"small"}
        />
      )}
      <Typography variant={"label2"}>Available options</Typography>
      <PresetOptions />
      {linkedOptions.length > 0 && possibleLinkOptions.length > 0 && (
        <Box sx={{ width: "100%" }}>
          {linksFields.map((item, inputIndex) => {
            return (
              <Box
                key={item.id}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <Select<FlowSchemaType>
                  size={"small"}
                  name={`steps.${stepIndex}.fieldSet.fields.${fieldIndex}.optionsConfig.linkedResultOptions.${inputIndex}.id`}
                  key={"links" + inputIndex.toString() + stepIndex.toString()}
                  selectOptions={possibleLinkOptions}
                  renderValue={(val) => {
                    return (
                      <div
                        style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {val
                          ? getSelectOptionName(possibleLinkOptions, val as string)
                          : "Select a previous result"}
                      </div>
                    );
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
      {hasRequestDefinedOptions && (
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
              <Select<FlowSchemaType>
                name={`steps.${stepIndex}.fieldSet.fields.${fieldIndex}.optionsConfig.requestOptionsDataType`}
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
              append(createDefaultOptionState());
            }}
          >
            Add option
          </Button>
          {possibleLinkOptions.length > 0 && (
            <Button
              sx={{ position: "relative" }}
              variant="text"
              size="small"
              onClick={() => {
                linksAppend({ id: (possibleLinkOptions[0]?.value as string) ?? "" });
              }}
            >
              Use previous result as option(s)
            </Button>
          )}
          {!hasRequestDefinedOptions && reusable && stepIndex === 0 && (
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
