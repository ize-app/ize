import { Typography } from "@mui/material";
import { useFormContext } from "react-hook-form";

import { TextField } from "@/components/Form/formFields";

import { FieldBlock } from "./FieldBlock";
import { ButtonGroupField } from "../ButtonGroupField";
import { AIOutputType, IntitialFlowSetupSchemaType } from "../formValidation";

export const SummaryForm = () => {
  const { control, watch } = useFormContext<IntitialFlowSetupSchemaType>();

  const question = watch("question");
  const aiOutputType = watch("aiOutputType");

  return (
    <>
      <FieldBlock>
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
      </FieldBlock>
      {question && (
        <FieldBlock>
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
        </FieldBlock>
      )}
      {aiOutputType && (
        <>
          <FieldBlock>
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
          </FieldBlock>
        </>
      )}
    </>
  );
};
