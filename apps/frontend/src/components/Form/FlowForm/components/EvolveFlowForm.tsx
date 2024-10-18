import { Box, FormHelperText, InputAdornment, Typography } from "@mui/material";
import { UseFormReturn } from "react-hook-form";

import { EntitySearch, Select, TextField } from "@/components/Form/formFields";
import { DecisionType } from "@/graphql/generated/graphql";

import { PanelAccordion } from "../../../ConfigDiagram/ConfigPanel/PanelAccordion";
import { FlowSchemaType } from "../formValidation/flow";
import { PermissionType } from "../formValidation/permission";

interface EvolveProcessFormProps {
  formMethods: UseFormReturn<FlowSchemaType>;
  show: boolean;
}

export const EvolveFlowForm = ({ formMethods, show }: EvolveProcessFormProps) => {
  const requestPermissionType = formMethods.getValues(`evolve.requestPermission.type`);

  const responsePermissionType = formMethods.getValues(`evolve.responsePermission.type`);

  const decisionType = formMethods.getValues(`evolve.decision.type`);

  const error = formMethods.formState.errors.evolve;

  return (
    <Box sx={{ display: show ? "box" : "none" }}>
      <PanelAccordion
        title="Trigger permissions"
        hasError={!!formMethods.formState.errors.evolve?.requestPermission}
      >
        {error?.root?.message && (
          <FormHelperText
            sx={{
              color: "error.main",
            }}
          >
            {error?.root?.message}
          </FormHelperText>
        )}
        <Select
          name={`evolve.requestPermission.type`}
          selectOptions={[
            { name: "Certain individuals and groups", value: PermissionType.Entities },
            { name: "Anyone can request", value: PermissionType.Anyone },
          ]}
          label="Who can make requests?"
        />

        {requestPermissionType === PermissionType.Entities && (
          <EntitySearch
            key="requestRoleSearch"
            ariaLabel={"Individuals and groups who can make requests"}
            name={`evolve.requestPermission.entities`}
            control={formMethods.control}
            setFieldValue={formMethods.setValue}
            getFieldValues={formMethods.getValues}
          />
        )}
      </PanelAccordion>
      <PanelAccordion
        title="Response permissions"
        hasError={!!formMethods.formState.errors.evolve?.responsePermission}
      >
        <Select
          name={`evolve.responsePermission.type`}
          selectOptions={[
            { name: "Certain individuals and groups", value: PermissionType.Entities },
            { name: "Anyone can request", value: PermissionType.Anyone },
          ]}
          label="Who can make requests?"
        />

        {responsePermissionType === PermissionType.Entities && (
          <EntitySearch
            key="requestRoleSearch"
            ariaLabel={"Individuals and groups who can make requests"}
            name={`evolve.responsePermission.entities`}
            control={formMethods.control}
            setFieldValue={formMethods.setValue}
            getFieldValues={formMethods.getValues}
          />
        )}
      </PanelAccordion>
      <PanelAccordion
        title="Decision config"
        hasError={!!formMethods.formState.errors.evolve?.decision}
      >
        <Typography variant="description">
          After a decision, the proposed evolution will be autoamtically applied.
        </Typography>
        <Select<FlowSchemaType>
          label="How do we determine the final result?"
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
        />

        {decisionType === DecisionType.NumberThreshold && (
          <TextField<FlowSchemaType>
            label="Threshold votes"
            name={`evolve.decision.threshold`}
            size="small"
            showLabel={false}
            endAdornment={<InputAdornment position="end">votes to win</InputAdornment>}
          />
        )}
        {decisionType === DecisionType.PercentageThreshold && (
          <TextField<FlowSchemaType>
            label="Option selected with"
            size="small"
            showLabel={false}
            name={`evolve.decision.threshold`}
            endAdornment={<InputAdornment position="end">% of responses</InputAdornment>}
          />
        )}
      </PanelAccordion>
    </Box>
  );
};
