import { Typography } from "@mui/material";
import { useFormContext } from "react-hook-form";

import { ButtonGroupField, TextField } from "@/components/Form/formFields";

import { FieldBlockFadeIn } from "../../../components/Form/formLayout/FieldBlockFadeIn";
import { AIOutputType, IntitialFlowSetupSchemaType } from "../formValidation";

export const SummaryForm = () => {
  const { watch } = useFormContext<IntitialFlowSetupSchemaType>();

  const question = watch("question");
  const aiOutputType = watch("aiOutputType");

  return (
    <>
      <FieldBlockFadeIn>
        <Typography variant="description">What&apos;s your question to the group?</Typography>
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
              multiline
              placeholderText={"Prompt for the AI"}
              label={``}
              defaultValue=""
            />
          </FieldBlockFadeIn>
        </>
      )}
    </>
  );
};
