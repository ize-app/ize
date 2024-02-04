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
import {
  FreeInputResponseType,
  OptionsCreationType,
  InputDataType,
  RequestPermissionType,
  RespondInputType,
  RespondPermissionType,
} from "../types";
import { ResponsiveFormRow } from "./ResponsiveFormRow";
import { ResponseOptionsForm } from "./ResponseOptionsForm";

interface StepFormProps {
  useFormMethods: UseFormReturn<NewFlowFormFields>;
  formIndex: number; // react-hook-form name
}

export const StepForm = ({ useFormMethods, formIndex }: StepFormProps) => {
  console.log("form errors are ", useFormMethods.formState.errors);
  //   const makeFormFieldName = (index: number, fieldName: string): FieldPath<NewFlowFormFields> =>
  //     `steps.${index}.${fieldName}`;
  //     const preFix =

  const { control, setValue: setFieldValue, getValues: getFieldValues, watch } = useFormMethods;

  const requestInputFormMethods = useFieldArray({
    control,
    name: `steps.${formIndex}.request.inputs`,
  });

  const responseOptionsFormMethods = useFieldArray({
    control,
    name: `steps.${formIndex}.respond.inputs.options.options`,
  });

  const isAgentRequestTrigger =
    watch(`steps.${formIndex}.request.permission.type`) === RequestPermissionType.Agents;

  const isAgentRespondTrigger =
    watch(`steps.${formIndex}.respond.permission.type`) === RespondPermissionType.Agents;

  const respondInputType = watch(`steps.${formIndex}.respond.inputs.type`);

  const responseOptionsDataType = watch(`steps.${formIndex}.respond.inputs.options.options`);

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
              { name: "Certain individuals and groups", value: RequestPermissionType.Agents },
              { name: "Anyone", value: RequestPermissionType.Anyone },
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
                  name: "",
                  required: true,
                  dataType: InputDataType.String,
                });
              }}
            >
              Add required inputs to make a request
            </Button>
          )}
        </Box>
      </StepComponentContainer>
      <StepComponentContainer label="Respond">
        <ResponsiveFormRow>
          <Select
            control={control}
            width="300px"
            name={`steps.${formIndex}.respond.permission.type`}
            selectOptions={[
              { name: "Certain individuals and groups", value: RequestPermissionType.Agents },
              { name: "Anyone", value: RequestPermissionType.Anyone },
            ]}
            label="Who can respond?"
          />

          {isAgentRespondTrigger && (
            <RoleSearch
              ariaLabel={"Individuals and groups who can respond"}
              name={`steps.${formIndex}.respond.permission.agents`}
              control={control}
              setFieldValue={setFieldValue}
              getFieldValues={getFieldValues}
            />
          )}
        </ResponsiveFormRow>
        <ResponsiveFormRow>
          <Select
            control={control}
            width="300px"
            name={`steps.${formIndex}.respond.inputs.type`}
            selectOptions={[
              { name: "Free text input", value: RespondInputType.FreeInput },
              { name: "Choose one option", value: RespondInputType.SelectOption },
              { name: "Rank options", value: RespondInputType.RankOptions },
              { name: "Group options", value: RespondInputType.GroupOptions },
            ]}
            label="What info does the respondant give?"
          />
          {respondInputType === RespondInputType.FreeInput && (
            <>
              <Select
                control={control}
                width="200px"
                name={`steps.${formIndex}.respond.inputs.freeInput.dataType`}
                selectOptions={[
                  { name: "Text", value: InputDataType.String },
                  { name: "Number", value: InputDataType.Number },
                  { name: "Uri", value: InputDataType.Uri },
                ]}
                label="What type of input?"
              />
            </>
          )}
          {respondInputType &&
            [
              RespondInputType.GroupOptions,
              RespondInputType.RankOptions,
              RespondInputType.SelectOption,
            ].includes(respondInputType) && (
              <>
                <Select
                  control={control}
                  width="300px"
                  name={`steps.${formIndex}.respond.inputs.options.creationType`}
                  selectOptions={[
                    {
                      name: "The process",
                      value: OptionsCreationType.ProcessDefinedOptions,
                    },
                    {
                      name: "The requestor",
                      value: OptionsCreationType.RequestDefinedOptions,
                    },
                  ]}
                  label="Who defines the options?"
                />
                <Select
                  control={control}
                  width="200px"
                  name={`steps.${formIndex}.respond.inputs.options.dataType`}
                  selectOptions={[
                    { name: "Text", value: InputDataType.String },
                    { name: "Number", value: InputDataType.Number },
                    { name: "Uri", value: InputDataType.Uri },
                    { name: "Date", value: InputDataType.Date },
                    { name: "DateTime", value: InputDataType.DateTime },
                  ]}
                  label="Option type?"
                />
                <ResponseOptionsForm
                  useFormMethods={useFormMethods}
                  //@ts-ignore Not sure why the TS error - types are the same
                  responseOptionsFormMethods={responseOptionsFormMethods}
                  formIndex={formIndex}
                />
              </>
            )}
        </ResponsiveFormRow>
        {/* <Box sx={{ width: "100%", display: "flex", gap: "24px" }}> */}
        {/*         <Controller
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
            /> */}
        {/* </Box> */}
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
