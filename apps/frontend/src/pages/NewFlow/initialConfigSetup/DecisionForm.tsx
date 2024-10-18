import { Typography } from "@mui/material";
import { useFormContext } from "react-hook-form";

import { ButtonGroupField, TextField } from "@/components/Form/formFields";
import { FieldBlockFadeIn } from "@/components/Form/formLayout/FieldBlockFadeIn";
import { DecisionType } from "@/graphql/generated/graphql";

import { OptionsForm } from "./OptionsForm";
import { IntitialFlowSetupSchemaType } from "../formValidation";

export const DecisionForm = () => {
  const { watch } = useFormContext<IntitialFlowSetupSchemaType>();

  const question = watch("question");
  const decisionType = watch("decisionType");

  return (
    <>
      <FieldBlockFadeIn>
        <Typography variant="description">What are you deciding on?</Typography>
        <TextField<IntitialFlowSetupSchemaType>
          // assuming here that results to fields is 1:1 relationshp
          name={`question`}
          multiline
          placeholderText={"What's your question to the group?"}
          label={``}
          defaultValue=""
        />
      </FieldBlockFadeIn>
      {question && (
        <FieldBlockFadeIn>
          <Typography variant="description">How will you decide?</Typography>
          <ButtonGroupField<IntitialFlowSetupSchemaType>
            label="Decision type"
            name={`decisionType`}
            options={[
              {
                name: "First option to reach threshold is chosen",
                title: "Threshold",
                value: DecisionType.NumberThreshold,
              },
              {
                name: ">50% vote to decide",
                title: "Majority vote",
                value: DecisionType.NumberThreshold,
              },
              {
                name: "Let AI decide",
                title: "AI",
                value: DecisionType.Ai,
              },
            ]}
          />
        </FieldBlockFadeIn>
      )}
      {decisionType && <OptionsForm />}
    </>
  );
};
