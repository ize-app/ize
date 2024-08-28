import { Typography } from "@mui/material";
import { useFormContext } from "react-hook-form";

import { TextField } from "@/components/Form/formFields";

import { FieldBlock } from "./FieldBlock";
import { OptionsForm } from "./OptionsForm";
import { IntitialFlowSetupSchemaType } from "../formValidation";

export const PrioritizationForm = () => {
  const { control, watch } = useFormContext<IntitialFlowSetupSchemaType>();

  const decisionName = watch("question");

  return (
    <>
      <FieldBlock>
        <Typography variant="description">Describe what you want to prioritize</Typography>
        <TextField<IntitialFlowSetupSchemaType>
          // assuming here that results to fields is 1:1 relationshp
          name={`question`}
          control={control}
          multiline
          placeholderText={"What are you deciding on"}
          label={``}
          defaultValue=""
        />
      </FieldBlock>
      {decisionName && <OptionsForm />}
    </>
  );
};
