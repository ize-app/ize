import { Typography } from "@mui/material";
import { useFormContext } from "react-hook-form";

import { TextField } from "@/components/Form/formFields";
import { FieldBlockFadeIn } from "@/components/Form/formLayout/FieldBlockFadeIn";

import { OptionsForm } from "./OptionsForm";
import { IntitialFlowSetupSchemaType } from "../formValidation";

export const DecisionForm = () => {
  const { watch, control } = useFormContext<IntitialFlowSetupSchemaType>();

  const question = watch("question");

  return (
    <>
      <FieldBlockFadeIn>
        <Typography variant="description">What are you deciding on?</Typography>
        <TextField<IntitialFlowSetupSchemaType>
          // assuming here that results to fields is 1:1 relationshp
          name={`question`}
          control={control}
          multiline
          placeholderText={"What's your question to the group?"}
          label={``}
          defaultValue=""
        />
      </FieldBlockFadeIn>
      {question && <OptionsForm />}
    </>
  );
};
