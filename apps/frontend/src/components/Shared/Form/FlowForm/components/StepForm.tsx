import { FieldPath, FieldValues, UseFormReturn, useFieldArray } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { requestTemplateFormSchema } from "../../ProcessForm/formSchema";

import { useNewFlowWizardState, NewFlowFormFields } from "@/components/NewFlow/newFlowWizard";
import { RoleSearch, Select, Switch, TextField } from "@/components/shared/Form/FormFields";
import { DecisionType, FormOptionChoice } from "@/components/shared/Form/ProcessForm/types";
import { WizardBody, WizardNav } from "@/components/shared/Wizard";
import { Autocomplete, Button, Chip, InputAdornment, Paper, Step, Typography } from "@mui/material";
import { RequestInputsForm } from "./RequestInputsForm";
import { Accordion } from "@/components/shared/Accordion";
import React, { useState } from "react";
import { flowSchema } from "../formSchema";
import { RoleFormFields } from "../../ProcessForm/wizardScreens/Roles";

import { StepContainer, StepComponentContainer } from "./StepContainer";
import {
  FreeInputResponseType,
  OptionsCreationType,
  InputDataType,
  RequestPermissionType,
  StepType,
  RespondPermissionType,
  OptionSelectionType,
  ResultDecisionType,
} from "../types";
import { ResponsiveFormRow } from "./ResponsiveFormRow";
import { ResponseOptionsForm } from "./ResponseOptionsForm";
import { ResponseInputsForm } from "./ResponseInputsForm";
import { ResponsePermissionsForm } from "./ResponsePermissionsForm";
// import { RespondInputsForm } from "./RespondInputsForm";

interface StepFormProps {
  useFormMethods: UseFormReturn<NewFlowFormFields>;
  formIndex: number; // react-hook-form name
}

export const StepForm = ({ useFormMethods, formIndex }: StepFormProps) => {
  const {
    control,
    setValue: setFieldValue,
    getValues: getFieldValues,
    watch,
    getFieldState,
  } = useFormMethods;

  console.log("errors are ", useFormMethods.formState.errors);

  // const requestInputFormMethods = useFieldArray({
  //   control,
  //   name: `steps.${formIndex}.request.inputs`,
  // });

  const responseOptionsFormMethods = useFieldArray({
    control,
    name: `steps.${formIndex}.respond.inputs.options.options`,
  });
  // const isAgentRequestTrigger =
  //   watch(`steps.${formIndex}.request.permission.type`) === RequestPermissionType.Agents;
  // const isAgentRespondTrigger =
  //   watch(`steps.${formIndex}.respond.permission.type`) === RespondPermissionType.Agents;
  const stepType = watch(`steps.${formIndex}.respond.inputs.type`);
  const isMultiSelect =
    watch(`steps.${formIndex}.respond.inputs.options.selectionType`) ===
    OptionSelectionType.MultiSelect;
  const optionCreationType = watch(`steps.${formIndex}.respond.inputs.options.creationType`);

  const getInputStepHeader = (stepType: StepType) => {
    switch (stepType) {
      case StepType.Decide:
        return "What options are being decided on?";
      case StepType.Prioritize:
        return "What options are being prioritized?";
      case StepType.GetInput:
        return "What kind of information are you asking for?";
    }
  };

  // const hasRequestInputs = (watch(`steps.${formIndex}.request.inputs`) ?? []).length > 0;
  return (
    <StepContainer>
      <StepComponentContainer>
        <Select
          control={control}
          label="Purpose of this step"
          name={`steps.${formIndex}.respond.inputs.type`}
          width="300px"
          selectOptions={[
            { name: "Decide", value: StepType.Decide },
            { name: "Get ideas and feedback", value: StepType.GetInput },
            { name: "Prioritize", value: StepType.Prioritize },
          ]}
        />
      </StepComponentContainer>
      <ResponseInputsForm
        formMethods={useFormMethods}
        //@ts-ignore
        responseOptionsFormMethods={responseOptionsFormMethods}
        formIndex={formIndex}
      />
      <ResponsePermissionsForm formMethods={useFormMethods} formIndex={formIndex} />
      {/* <RespondInputsForm stepType={stepType} /> */}
      {/* {stepPurpose && (
        <>
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

          </StepComponentContainer>
          <StepComponentContainer label="Result">
            <ResponsiveFormRow>
              {stepPurpose === StepType.Decide && (
                <>
                  <Select<NewFlowFormFields>
                    control={control}
                    label="How do we determine the final result?"
                    width="300px"
                    selectOptions={[
                      { name: "Theshold count", value: ResultDecisionType.ThresholdVote },
                      { name: "Percentage threshold", value: ResultDecisionType.PercentageVote },
                      { name: "Optimistic vote", value: ResultDecisionType.OptimisticVote },
                    ]}
                    name={`steps.${formIndex}.result.decide.type`}
                  />

                  <TextField<NewFlowFormFields>
                    control={control}
                    width="300px"
                    label="Threshold votes"
                    variant="outlined"
                    name={`steps.${formIndex}.result.decide.threshold.decisionThresholdCount`}
                  />
                  <TextField<NewFlowFormFields>
                    control={control}
                    width="300px"
                    label="Percentage threshold"
                    variant="outlined"
                    name={`steps.${formIndex}.result.decide.percentage.decisionThresholdPercentage`}
                  />
                  <TextField<NewFlowFormFields>
                    control={control}
                    width="300px"
                    label="Threshold votes to choose another option"
                    variant="outlined"
                    name={`steps.${formIndex}.result.decide.optimistic.decisionThresholdCount`}
                  />
                  <Select<NewFlowFormFields>
                    control={control}
                    label="Default option"
                    width="300px"
                    selectOptions={[
                      { name: "Theshold count", value: ResultDecisionType.ThresholdVote },
                      { name: "Percentage threshold", value: ResultDecisionType.PercentageVote },
                      { name: "Optimistic vote", value: ResultDecisionType.OptimisticVote },
                    ]}
                    name={`steps.${formIndex}.result.decide.optimistic.defaultOptionId`}
                  />
                </>
              )}
            </ResponsiveFormRow>
          </StepComponentContainer> */}
      {/* </> */}
      {/* )} */}
    </StepContainer>
  );
};
