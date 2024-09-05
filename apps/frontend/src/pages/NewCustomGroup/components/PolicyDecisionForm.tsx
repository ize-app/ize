import { InputAdornment } from "@mui/material";
import { useFormContext } from "react-hook-form";

import { Select, TextField } from "@/components/Form/formFields";
import { ResponsiveFormRow } from "@/components/Form/formLayout/ResponsiveFormRow";
import { DecisionType } from "@/graphql/generated/graphql";

import { GroupSetupAndPoliciesSchemaType } from "../formValidation";

export const PolicyDecisionForm = ({ flowType }: { flowType: "evolveGroup" | "watch" }) => {
  const { watch, control } = useFormContext<GroupSetupAndPoliciesSchemaType>();

  const decisionType = watch(`flows.${flowType}.decision.type`);

  return (
    <ResponsiveFormRow sx={{ gap: "16px" }}>
      {" "}
      <Select<GroupSetupAndPoliciesSchemaType>
        control={control}
        label="How do we determine the final result?"
        selectOptions={[
          { name: "Threshold vote", value: DecisionType.NumberThreshold },
          { name: "Percentage vote", value: DecisionType.PercentageThreshold },
        ]}
        defaultValue=""
        name={`flows.${flowType}.decision.type`}
        size="small"
        // variant="standard"
        sx={{ flexGrow: 0 }}
      />
      {decisionType === DecisionType.NumberThreshold && (
        <TextField<GroupSetupAndPoliciesSchemaType>
          control={control}
          label="Threshold votes"
          name={`flows.${flowType}.decision.threshold`}
          size="small"
          //   variant="standard"
          sx={{ maxWidth: "200px" }}
          showLabel={false}
          defaultValue=""
          endAdornment={<InputAdornment position="end">votes to decide</InputAdornment>}
        />
      )}
      {decisionType === DecisionType.PercentageThreshold && (
        <TextField<GroupSetupAndPoliciesSchemaType>
          control={control}
          sx={{ maxWidth: "180px" }}
          label="Percentage votes"
          size="small"
          showLabel={false}
          defaultValue=""
          name={`flows.${flowType}.decision.threshold`}
          endAdornment={<InputAdornment position="end">% of votes to win</InputAdornment>}
        />
      )}
    </ResponsiveFormRow>
  );
};
