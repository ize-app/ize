import { InputAdornment, Typography } from "@mui/material";
import { useFormContext } from "react-hook-form";

import { ButtonGroupField, TextField } from "@/components/Form/formFields";
import { FieldBlockFadeIn } from "@/components/Form/formLayout/FieldBlockFadeIn";
import { DecisionType } from "@/graphql/generated/graphql";

import { OptionsForm } from "./OptionsForm";
import { IntitialFlowSetupSchemaType } from "../formValidation";

export const DecisionForm = () => {
  const { watch } = useFormContext<IntitialFlowSetupSchemaType>();

  const question = watch("question");
  const decisionType = watch("decision.type");

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
      {question && <OptionsForm />}
      {question && (
        <FieldBlockFadeIn>
          <Typography variant="description">How will you decide?</Typography>
          <ButtonGroupField<IntitialFlowSetupSchemaType>
            label="Decision type"
            name={`decision.type`}
            options={[
              {
                // name: "First option to reach threshold is chosen",
                name: "Threshold",
                value: DecisionType.NumberThreshold,
              },
              {
                // name: ">50% vote to decide",
                name: "Majority vote",
                value: DecisionType.PercentageThreshold,
              },
              {
                // name: "Choose highest weighed avg option",
                name: "Ranked vote",
                value: DecisionType.WeightedAverage,
              },
              {
                // name: "Let AI decide",
                name: "Let AI decide",
                value: DecisionType.Ai,
              },
            ]}
          />
        </FieldBlockFadeIn>
      )}
      {decisionType === DecisionType.Ai && (
        <>
          <FieldBlockFadeIn>
            <Typography variant="description">
              What criteria should the AI use to make a decision?
            </Typography>
            <TextField<IntitialFlowSetupSchemaType>
              // assuming here that results to fields is 1:1 relationshp
              name={`decision.criteria`}
              multiline
              placeholderText={"AI's decision criteria"}
              label={`AI Decision critieria`}
              defaultValue=""
            />
          </FieldBlockFadeIn>
        </>
      )}
      {decisionType === DecisionType.NumberThreshold && (
        <>
          <FieldBlockFadeIn>
            <Typography variant="description">
              How many votes are needed to approve a given option? Decision is made once this
              threshold is met.
            </Typography>
            <TextField<IntitialFlowSetupSchemaType>
              // assuming here that results to fields is 1:1 relationshp
              name={`decision.threshold`}
              sx={{ maxWidth: "300px" }}
              multiline
              placeholderText={""}
              label={`Number threshold`}
              defaultValue=""
              endAdornment={<InputAdornment position="end"># of votes to decide</InputAdornment>}
            />
          </FieldBlockFadeIn>
        </>
      )}
      {decisionType === DecisionType.PercentageThreshold && (
        <>
          <FieldBlockFadeIn>
            <Typography variant="description">
              Percentage of votes needed to choose an option
            </Typography>
            <TextField<IntitialFlowSetupSchemaType>
              // assuming here that results to fields is 1:1 relationshp
              name={`decision.threshold`}
              multiline
              sx={{ maxWidth: "300px" }}
              placeholderText={""}
              label={`Percentage vote threshold`}
              defaultValue=""
              endAdornment={<InputAdornment position="end">% of votes to decide</InputAdornment>}
            />
          </FieldBlockFadeIn>
        </>
      )}
    </>
  );
};
