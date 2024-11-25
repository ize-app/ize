import { Typography } from "@mui/material";
import { useFormContext } from "react-hook-form";

import { ButtonGroupField, TextField } from "@/components/Form/formFields";

import { FieldBlockFadeIn } from "../../../components/Form/formLayout/FieldBlockFadeIn";
import {
  AIOutputType,
  IntitialFlowSetupSchemaType,
  PerspectiveResultType,
} from "../formValidation";

export const GetPerspectivesForm = () => {
  const { watch } = useFormContext<IntitialFlowSetupSchemaType>();

  const question = watch("question");
  const resultType = watch("result.type");
  const aiOutputType = watch("result.aiOutputType");

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
          <Typography variant="description">
            What should the final output of this flow be?
          </Typography>
          <ButtonGroupField<IntitialFlowSetupSchemaType>
            label="Test"
            name={`result.type`}
            options={[
              {
                name: "AI summary",
                value: PerspectiveResultType.Ai,
              },
              {
                name: "Raw answers",
                value: PerspectiveResultType.Raw,
              },
            ]}
          />
        </FieldBlockFadeIn>
      )}
      {resultType === PerspectiveResultType.Ai && (
        <>
          <FieldBlockFadeIn>
            <Typography variant="description">
              What kind of output do you want from the AI
            </Typography>
            <ButtonGroupField<IntitialFlowSetupSchemaType>
              label="Test"
              name={`result.aiOutputType`}
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
          {aiOutputType && (
            <>
              <FieldBlockFadeIn>
                <Typography variant="description">
                  What kind of output do you want from the AI?
                </Typography>
                <TextField<IntitialFlowSetupSchemaType>
                  // assuming here that results to fields is 1:1 relationshp
                  name={`result.prompt`}
                  multiline
                  placeholderText={"Prompt for the AI"}
                  label={``}
                  defaultValue=""
                />
              </FieldBlockFadeIn>
            </>
          )}
        </>
      )}
    </>
  );
};
