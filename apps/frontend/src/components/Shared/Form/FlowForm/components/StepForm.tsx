import { FieldPath, FieldValues, UseFormReturn, useFieldArray } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import TextField from "@mui/material/TextField";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { requestTemplateFormSchema } from "../../ProcessForm/formSchema";

import { useNewFlowWizardState, NewFlowFormFields } from "@/components/NewFlow/newFlowWizard";
import { RoleSearch, Select } from "@/components/shared/Form/FormFields";
import { DecisionType, FormOptionChoice } from "@/components/shared/Form/ProcessForm/types";
import { WizardBody, WizardNav } from "@/components/shared/Wizard";
import { Autocomplete, Button, Chip, InputAdornment, Paper, Typography } from "@mui/material";
import { RequestInputsForm } from "./RequestInputsForm";
import { Accordion } from "@/components/shared/Accordion";
import React, { useState } from "react";
import { flowSchema } from "../formSchema";
import { TextField as MuiTextField } from "@/components/shared/Form/FormFields/TextField";
import { RoleFormFields } from "../../ProcessForm/wizardScreens/Roles";

import { StepContainer, StepComponentContainer } from "./StepContainer";
import { RequestInputDataType, RequestTriggerType } from "../types";
import { ResponsiveFormRow } from "./ResponsiveFormRow";

interface StepFormProps {
  useFormMethods: UseFormReturn<NewFlowFormFields>;
  formIndex: number; // react-hook-form name
}

export const StepForm = ({ useFormMethods, formIndex }: StepFormProps) => {
  //   const makeFormFieldName = (index: number, fieldName: string): FieldPath<NewFlowFormFields> =>
  //     `steps.${index}.${fieldName}`;
  //     const preFix =

  const { control, setValue: setFieldValue, getValues: getFieldValues, watch } = useFormMethods;

  const requestInputFormMethods = useFieldArray({
    control,
    name: `steps.${formIndex}.request.inputs`,
  });

  const isAgentRequestTrigger =
    watch(`steps.${formIndex}.request.permission.type`) === RequestTriggerType.Agents;

  const hasRequestInputs = (watch(`steps.${formIndex}.request.inputs`) ?? []).length > 0;
  return (
    <StepContainer>
      <StepComponentContainer label="Request">
        <ResponsiveFormRow>
          <Select
            control={control}
            width="300px"
            name={`steps.${formIndex}.request.permission.type`}
            selectOptions={[
              { name: "Certain individuals and groups", value: RequestTriggerType.Agents },
              { name: "Anyone", value: RequestTriggerType.Anyone },
            ]}
            label="Who can make requests?"
          />

          {isAgentRequestTrigger && (
            <RoleSearch
              ariaLabel={"Individuals and groups who can make requests"}
              name={`steps.${formIndex}.request.permission.agents`}
              control={control}
              setFieldValue={setFieldValue}
              getFieldValues={getFieldValues}
            />
          )}
        </ResponsiveFormRow>
        <Box sx={{ width: "100%", display: "flex", gap: "24px" }}>
          {hasRequestInputs ? (
            <RequestInputsForm
              useFormMethods={useFormMethods}
              formIndex={formIndex}
              //@ts-ignore Not sure why the TS error - types are the same
              requestInputFormMethods={requestInputFormMethods}
            />
          ) : (
            <Button
              variant={"outlined"}
              onClick={() => {
                requestInputFormMethods.append({
                  id: "new",
                  name: "",
                  required: true,
                  dataType: RequestInputDataType.String,
                });
              }}
            >
              Add request inputs
            </Button>
          )}
        </Box>
      </StepComponentContainer>
      <StepComponentContainer label="Respond">
        {/* <Box sx={{ width: "100%", display: "flex", gap: "24px" }}>
            <SelectControl
              //@ts-ignore
              control={control}
              width="400px"
              name={"decision.requestExpirationSeconds"}
              selectOptions={[
                { name: "Certain people", value: "Certain people" },
                { name: "Anyone", value: "Anyone" },
              ]}
              label="Who can respond?"
            />
            <RoleSearchControl
              name="x"
              //@ts-ignore
              control={control}
            />
          </Box>
          <Box sx={{ width: "100%", display: "flex", gap: "24px" }}>
            <SelectControl
              //@ts-ignore
              control={control}
              width="400px"
              name={"decision.requestExpirationSeconds"}
              selectOptions={[
                { name: "A set list of options", value: "Certain people" },
                { name: "Free text", value: "Anyone" },
              ]}
              label="How can they respond?"
            />
            <Controller
              name="customOptions"
              control={control}
              render={({ field, fieldState: { error } }) => {
                return (
                  <FormControl required sx={{ width: "100%" }}>
                    <Autocomplete
                      {...field}
                      freeSolo
                      multiple
                      autoComplete={false}
                      id="tags-filled"
                      options={[]}
                      getOptionLabel={(option: string) => option}
                      onChange={(_event, data) => field.onChange(data)}
                      renderTags={(value: readonly string[], getTagProps) =>
                        value.map((option: string, index: number) => (
                          <Chip
                            variant="filled"
                            label={option}
                            color="primary"
                            {...getTagProps({ index })}
                          />
                        ))
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          placeholder="Add custom options here..."
                          error={Boolean(error)}
                        />
                      )}
                    />
                    <FormHelperText
                      sx={{
                        color: "error.main",
                      }}
                    >
                      {error?.message}
                    </FormHelperText>
                  </FormControl>
                );
              }}
            />
          </Box> */}
      </StepComponentContainer>
      {/* <ProcessStepComponentContainer label="Result">
          <Box
            sx={{
              display: "flex",
              gap: "24px",
              justifyContent: "flex-start",
              flexWrap: "wrap",
            }}
          >
            <Box sx={{}}>
              <SelectControl
                //@ts-ignore
                control={control}
                name={"decision.type"}
                sx={{ width: "300px" }}
                selectOptions={[
                  {
                    value: DecisionType.Absolute,
                    name: "Threshold vote",
                  },
                  {
                    value: DecisionType.Percentage,
                    name: "Percentage vote",
                  },
                ]}
                label="When is there a final result?"
              />
            </Box>
            {false ? (
              <>
                <Box>
                  <TextFieldControl
                    //@ts-ignore
                    control={control}
                    name={"decision.percentageDecision.percentage"}
                    label={`Option becomes final result when it has:`}
                    endAdornment={<InputAdornment position="end">% of responses</InputAdornment>}
                    sx={{ width: "300px" }}
                    required
                  />
                </Box>
                <Box>
                  <TextFieldControl
                    //@ts-ignore
                    control={control}
                    name={"decision.percentageDecision.quorum"}
                    label={`Quorum (min # of responses for a result)`}
                    endAdornment={<InputAdornment position="end">total responses</InputAdornment>}
                    sx={{ width: "300px" }}
                    required
                  />
                </Box>
              </>
            ) : (
              <Box>
                <TextFieldControl
                  //@ts-ignore
                  control={control}
                  name={"decision.absoluteDecision.threshold"}
                  label={"Option is selected once it has:"}
                  sx={{ width: "300px" }}
                  endAdornment={<InputAdornment position="end">responses</InputAdornment>}
                  required
                />
              </Box>
            )}
          </Box>
        </ProcessStepComponentContainer> */}
    </StepContainer>
  );
};
