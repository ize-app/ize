import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { requestTemplateFormSchema } from "../../ProcessForm/formSchema";

import { useNewFlowWizardState, NewFlowFormFields } from "@/components/NewFlow/newFlowWizard";
import { RoleSearchControl, SelectControl } from "@/components/shared/Form";
import { DecisionType, FormOptionChoice } from "@/components/shared/Form/ProcessForm/types";
import { WizardBody, WizardNav } from "@/components/shared/Wizard";
import { Autocomplete, Chip, InputAdornment, Paper, Typography } from "@mui/material";
import { RequestTemplateInputTable } from "../components/RequestInputTable";
import { Accordion } from "@/components/shared/Accordion";
import React from "react";
import { flowSchema } from "../formSchema";
import { TextField } from "@/components/shared/Form/FormFields/TextField";
import { RoleFormFields } from "../../ProcessForm/wizardScreens/Roles";
import { StepForm } from "../components/StepForm";
import { StepsForm } from "../components/StepsForm";
import { RequestTriggerType } from "../types";

export const Setup = () => {
  const { formState, setFormState, onNext, onPrev, nextLabel } = useNewFlowWizardState();

  const useFormMethods = useForm<NewFlowFormFields>({
    defaultValues: {
      name: "",
      steps: [{ request: { permission: { type: RequestTriggerType.Agents, agents: [] } } }],
    },
    resolver: zodResolver(flowSchema),
    shouldUnregister: true,
  });

  const onSubmit = (data: NewFlowFormFields) => {
    onNext();
  };

  return (
    <>
      <WizardBody>
        <form>
          <TextField<NewFlowFormFields>
            name={"name"}
            control={useFormMethods.control}
            placeholderText=""
            label="Flow name"
            variant="standard"
          />
          <StepsForm useFormMethods={useFormMethods} />
        </form>
      </WizardBody>
      <WizardNav
        onNext={useFormMethods.handleSubmit(onSubmit)}
        onPrev={onPrev}
        nextLabel={nextLabel}
      />
    </>
  );
};
