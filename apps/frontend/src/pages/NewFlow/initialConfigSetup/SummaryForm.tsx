import { Typography } from "@mui/material";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

import { ButtonGroupField, TextField } from "@/components/Form/formFields";

import { FieldBlockFadeIn } from "../../../components/Form/formLayout/FieldBlockFadeIn";
import { AIOutputType, IntitialFlowSetupSchemaType } from "../formValidation";

export const SummaryForm = () => {
  const { control, watch, setValue } = useFormContext<IntitialFlowSetupSchemaType>();

  const question = watch("question");
  const aiOutputType = watch("aiOutputType");

  useEffect(() => {}, [
    setValue(
      "prompt",
      "Summarize overall thoughts and sentiment of the group, common points of disagreement, and next steps.",
    ),
    setValue(
      "example",
      "Points of agreement: \n- Do A for reason X\n- Create B but consider Y\n\nPoints of disagreement: \n- No alignment on whether we should take path C because reason Z",
    ),
  ]);

  return (
    <>
      <FieldBlockFadeIn>
        <Typography variant="description">What&apos;s your question to the group?</Typography>
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
      {question && (
        <FieldBlockFadeIn>
          <Typography variant="description">What kind of output do you want from the AI</Typography>
          <ButtonGroupField<IntitialFlowSetupSchemaType>
            label="Test"
            name={`aiOutputType`}
            options={[
              {
                name: "Single summary",
                value: AIOutputType.Summary,
              },
              {
                name: "List of outputs",
                value: AIOutputType.List,
              },
            ]}
          />
        </FieldBlockFadeIn>
      )}
      {aiOutputType && (
        <>
          <FieldBlockFadeIn>
            <Typography variant="description">
              What kind of output do you want from the AI?
            </Typography>
            <TextField<IntitialFlowSetupSchemaType>
              // assuming here that results to fields is 1:1 relationshp
              name={`prompt`}
              control={control}
              multiline
              placeholderText={"Prompt for the AI"}
              label={``}
              defaultValue=""
            />
            <TextField<IntitialFlowSetupSchemaType>
              // assuming here that results to fields is 1:1 relationshp
              name={`example`}
              control={control}
              multiline
              placeholderText={"example output from the AI"}
              label={``}
              defaultValue=""
            />
          </FieldBlockFadeIn>
        </>
      )}
    </>
  );
};
