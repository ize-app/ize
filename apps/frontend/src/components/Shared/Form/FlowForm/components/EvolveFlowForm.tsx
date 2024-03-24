import { UseFormReturn } from "react-hook-form";

import { FlowSchemaType } from "../formValidation/flow";
import { RoleSearch, Select, TextField } from "@/components/shared/Form/formFields";

import { StepComponentContainer, StepContainer } from "./StepContainer";
import { ResponsiveFormRow } from "../../formLayout/ResponsiveFormRow";
import { PermissionType } from "../formValidation/permission";

import { Box, InputAdornment } from "@mui/material";

import { DecisionType } from "@/graphql/generated/graphql";

interface EvolveProcessFormProps {
  formMethods: UseFormReturn<FlowSchemaType>;
  handleStepExpansion: (_event: React.SyntheticEvent, newExpanded: boolean) => void;
  expandedStep: number | "EvolveStep" | false;
}

export const EvolveFlowForm = ({
  formMethods,
  handleStepExpansion,
  expandedStep,
}: EvolveProcessFormProps) => {
  const requestPermissionType = formMethods.watch(`evolve.requestPermission.type`);

  const responsePermissionType = formMethods.watch(`evolve.responsePermission.type`);

  const decisionType = formMethods.watch(`evolve.decision.type`);

  return (
    <StepContainer
      expandedStep={expandedStep}
      handleStepExpansion={handleStepExpansion}
      stepIdentifier={"EvolveStep"}
      title={`How this flow evolves`}
    >
      <StepComponentContainer label={"Request"}>
        <Box sx={{ display: "none" }}>
          {/* <Select<FlowSchemaType>
            control={formMethods.control}
            label="Default option"
            width="200px"
            // renderValue={(val) => {
            //   if (val === DefaultOptionSelection.None)
            //     return "If there is no decision, there is no result.";
            //   const option = defaultDecisionOptions.find((option) => option.value === val);
            //   if (option) {
            //     return "Default result if no decision: " + option.name;
            //   } else return "No default result";
            // }}
            // selectOptions={defaultDecisionOptions}
            selectOptions={[]}
            displayLabel={false}
            flexGrow="1"
            name={`evolve.decision.defaultOptionId`}
          /> */}
        </Box>
        <ResponsiveFormRow>
          <Select
            control={formMethods.control}
            width="300px"
            name={`evolve.requestPermission.type`}
            selectOptions={[
              { name: "Certain individuals and groups", value: PermissionType.Entities },
              { name: "Anyone can request", value: PermissionType.Anyone },
            ]}
            label="Who can make requests?"
          />

          {requestPermissionType === PermissionType.Entities && (
            <RoleSearch
              key="requestRoleSearch"
              ariaLabel={"Individuals and groups who can make requests"}
              name={`evolve.requestPermission.entities`}
              control={formMethods.control}
              setFieldValue={formMethods.setValue}
              getFieldValues={formMethods.getValues}
            />
          )}
        </ResponsiveFormRow>
      </StepComponentContainer>
      <StepComponentContainer label={"Respond"}>
        <ResponsiveFormRow>
          <Select
            control={formMethods.control}
            width="300px"
            name={`evolve.responsePermission.type`}
            selectOptions={[
              { name: "Certain individuals and groups", value: PermissionType.Entities },
              { name: "Anyone can request", value: PermissionType.Anyone },
            ]}
            label="Who can make requests?"
          />

          {responsePermissionType === PermissionType.Entities && (
            <RoleSearch
              key="requestRoleSearch"
              ariaLabel={"Individuals and groups who can make requests"}
              name={`evolve.responsePermission.entities`}
              control={formMethods.control}
              setFieldValue={formMethods.setValue}
              getFieldValues={formMethods.getValues}
            />
          )}
        </ResponsiveFormRow>
      </StepComponentContainer>
      <StepComponentContainer label={"Result"}>
        If flow evolution request is approved, the evolution will be autoamtically applied.
      </StepComponentContainer>
      <>
        <ResponsiveFormRow>
          <Select<FlowSchemaType>
            control={formMethods.control}
            label="How do we determine the final result?"
            width="300px"
            selectOptions={[
              {
                name: "When an option gets x # of votes",
                value: DecisionType.NumberThreshold,
              },
              {
                name: "When an option gets x % of votes",
                value: DecisionType.PercentageThreshold,
              },
            ]}
            name={`evolve.decision.type`}
            size="small"
            displayLabel={false}
          />

          {decisionType === DecisionType.NumberThreshold && (
            <TextField<FlowSchemaType>
              control={formMethods.control}
              width="300px"
              label="Threshold votes"
              name={`evolve.decision.threshold`}
              size="small"
              variant="standard"
              showLabel={false}
              endAdornment={<InputAdornment position="end">votes to win</InputAdornment>}
            />
          )}
          {decisionType === DecisionType.PercentageThreshold && (
            <TextField<FlowSchemaType>
              control={formMethods.control}
              width="300px"
              label="Option selected with"
              size="small"
              variant="standard"
              showLabel={false}
              name={`evolve.decision.threshold`}
              endAdornment={<InputAdornment position="end">% of responses</InputAdornment>}
            />
          )}
        </ResponsiveFormRow>
      </>
    </StepContainer>
  );
};
