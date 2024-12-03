import CloseIcon from "@mui/icons-material/Close";
import LinkIcon from "@mui/icons-material/Link";
import { Box, FormHelperText, InputAdornment, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { useFieldArray, useFormContext } from "react-hook-form";

import { LabeledGroupedInputs } from "@/components/Form/formLayout/LabeledGroupedInputs";
import { OptionSelectionType } from "@/graphql/generated/graphql";

import { AddOptionButton } from "../AddOptionButton";
import { TriggerDefinedOptionsForm } from "./TriggerDefinedOptionsForm";
import { Select } from "../../../formFields";
import { SelectOption } from "../../../formFields/Select";
import { ResponsiveFormRow } from "../../../formLayout/ResponsiveFormRow";
import { getSelectOptionName } from "../../../utils/getSelectOptionName";
import { FlowSchemaType, StepSchemaType } from "../../formValidation/flow";
import { getResultFormLabel } from "../../helpers/getResultFormLabel";
import { maxOptionSelectionsOptions } from "../maxOptionSelections";
import { UsePresetOptionsForm } from "../UsePresetOptionsForm";

const createLinkOptions = (steps: StepSchemaType[], currentStepIndex: number) => {
  const results: SelectOption[] = [];
  steps.forEach((s, stepIndex) => {
    // only include results from previous steps
    if (currentStepIndex <= stepIndex) return;
    s.result.forEach((r) => {
      const field = (s.fieldSet?.fields ?? []).find((f) => f.fieldId === r.fieldId);
      results.push({
        name: `${getResultFormLabel({ result: r })} from step ${stepIndex + 1}${field?.name ? `: "${field.name}"` : ""}`,
        value: r.resultConfigId,
      });
    });
  });
  return results;
};

interface ResponseFieldOptionsFormProps {
  stepIndex: number;
  fieldIndex: number;
  locked: boolean;
  reusable: boolean;
}

const getSelectionTypeOptions = (selectionType: OptionSelectionType) => {
  if (selectionType === OptionSelectionType.None) {
    return [{ name: "Not answered by respondants", value: OptionSelectionType.None }];
  } else
    return [
      { name: "Choose option(s)", value: OptionSelectionType.Select },
      { name: "Rank", value: OptionSelectionType.Rank },
    ];
};

export const ResponseFieldOptionsForm = ({
  stepIndex,
  fieldIndex,
  locked,
  reusable,
}: ResponseFieldOptionsFormProps) => {
  const { control, getValues, watch, formState } = useFormContext<FlowSchemaType>();

  const { PresetOptions, optionsArrayMethods } = UsePresetOptionsForm<FlowSchemaType>({
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

  const linkedOptions =
    getValues(
      `steps.${stepIndex}.fieldSet.fields.${fieldIndex}.optionsConfig.linkedResultOptions`,
    ) ?? [];

  const optionsError =
    formState.errors?.steps?.[stepIndex]?.fieldSet?.fields?.[fieldIndex]?.root?.message ?? "";

  const optionSelectionType = watch(
    `steps.${stepIndex}.fieldSet.fields.${fieldIndex}.optionsConfig.selectionType`,
  );

  return (
    <Box sx={{ margin: "0px 0px" }}>
      <LabeledGroupedInputs
        // label="Options"
        sx={{
          padding: "16px",
          gap: "8px",
          display: "flex",
          flexDirection: "column",
          borderColor: "rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography variant="description">How participants select options</Typography>
        <ResponsiveFormRow>
          <Select<FlowSchemaType>
            defaultValue=""
            label="How do participants select options?"
            disabled={optionSelectionType === OptionSelectionType.None}
            selectOptions={getSelectionTypeOptions(optionSelectionType)}
            name={`steps.${stepIndex}.fieldSet.fields.${fieldIndex}.optionsConfig.selectionType`}
            size={"small"}
          />
          {optionSelectionType === OptionSelectionType.Select && (
            <Select<FlowSchemaType>
              defaultValue=""
              display={optionSelectionType === OptionSelectionType.Select}
              label="How many options can be selected?"
              selectOptions={maxOptionSelectionsOptions}
              name={`steps.${stepIndex}.fieldSet.fields.${fieldIndex}.optionsConfig.maxSelections`}
              size={"small"}
            />
          )}
        </ResponsiveFormRow>
        <Typography variant="description">Available options</Typography>
        {reusable && (
          <Box sx={{ marginRight: "40px" }}>
            <TriggerDefinedOptionsForm<FlowSchemaType>
              fieldName={`steps.${stepIndex}.fieldSet.fields.${fieldIndex}.optionsConfig.triggerDefinedOptions`}
            />
          </Box>
        )}
        <PresetOptions />
        {linkedOptions.length > 0 && (
          <Box sx={{ width: "100%" }}>
            {linksFields.map((item, inputIndex) => {
              return (
                <Box
                  key={item.id}
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Select<FlowSchemaType>
                    size={"small"}
                    name={`steps.${stepIndex}.fieldSet.fields.${fieldIndex}.optionsConfig.linkedResultOptions.${inputIndex}.id`}
                    key={"links" + inputIndex.toString() + stepIndex.toString()}
                    selectOptions={possibleLinkOptions}
                    placeholder="Select a previous result"
                    startAdornment={
                      <InputAdornment position="start">
                        <LinkIcon />
                      </InputAdornment>
                    }
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
                            ? (getSelectOptionName(possibleLinkOptions, val as string) ??
                              "Select a previous result")
                            : "Select a previous result"}
                        </div>
                      );
                    }}
                    label="Linked result"
                    displayEmpty={true}
                    defaultValue=""
                  />
                  <IconButton
                    color="primary"
                    aria-label="Remove linked options"
                    size="small"
                    sx={{ flexShrink: 1 }}
                    onClick={() => linksRemove(inputIndex)}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              );
            })}
          </Box>
        )}
        {!locked && (
          <ResponsiveFormRow sx={{ justifyContent: "space-between", paddingRight: "30px" }}>
            <AddOptionButton optionsArrayMethods={optionsArrayMethods} />
            {possibleLinkOptions.length > 0 && (
              <Button
                sx={{ position: "relative" }}
                variant="outlined"
                size="small"
                onClick={() => {
                  linksAppend({ id: (possibleLinkOptions[0]?.value as string) ?? "" });
                }}
              >
                Use previous result as option(s)
              </Button>
            )}
          </ResponsiveFormRow>
        )}

        {optionsError && (
          <FormHelperText
            sx={{
              color: "error.main",
            }}
          >
            {optionsError}
          </FormHelperText>
        )}
      </LabeledGroupedInputs>
    </Box>
  );
};
