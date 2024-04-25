import { Box, Button, Step } from "@mui/material";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { StepForm } from "./StepForm";
import { useEffect, useState } from "react";
import { FlowSchemaType } from "../formValidation/flow";
import { EvolveFlowForm } from "./EvolveFlowForm";
import { RequestForm } from "./RequestForm";
import { WebhookForm } from "./WebhookForm";
import { defaultStepFormValues } from "../helpers/getDefaultFormValues";
import { StageConnectorButton } from "./StageConnectorButton";
import { ActionType } from "../types";

interface StepFormProps {
  useFormMethods: UseFormReturn<FlowSchemaType>;
}

export const StepsForm = ({ useFormMethods }: StepFormProps) => {
  const fieldArrayName = "steps";

  const stepsArrayMethods = useFieldArray({
    control: useFormMethods.control,
    name: fieldArrayName,
  });

  const [expanded, setExpanded] = useState<string | false>("trigger0"); // change to step1
  const [showWebhook, setShowWebhook] = useState<boolean>(false);

  const handleStageExpansion =
    (stageIdentifier: string) => (_event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? stageIdentifier : false);
    };

  useEffect(() => {
    if (
      useFormMethods.getValues(`steps.${stepsArrayMethods.fields.length - 1}.action.type`) ===
      ActionType.CallWebhook
    ) {
      setShowWebhook(true);
    }
  }, []);

  console.log("form state is ", useFormMethods.getValues());
  console.log("errors are ", useFormMethods.formState.errors.steps);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      <RequestForm
        formMethods={useFormMethods}
        formIndex={0}
        expandedStep={expanded}
        handleStepExpansion={handleStageExpansion("trigger0")} // to fix
      />
      <StageConnectorButton />
      {stepsArrayMethods.fields.map((item, index) => {
        return (
          <Box>
            <StepForm
              id={item.id}
              useFormMethods={useFormMethods}
              formIndex={index}
              expandedStep={expanded}
              handleStepExpansion={handleStageExpansion("step" + index.toString())}
              //@ts-ignore
              stepsArrayMethods={stepsArrayMethods}
              key={"step" + index.toString()}
            />
            <StageConnectorButton />
          </Box>
        );
      })}
      {!showWebhook ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: "16px",
            flexWrap: "wrap",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "8px",
            marginBottom: "16px",
          }}
        >
          <Button
            variant="outlined"
            size="large"
            color="secondary"
            sx={{ border: "3px dashed", width: "240px" }}
            onClick={() => {
              stepsArrayMethods.append(defaultStepFormValues);
            }}
          >
            Add collaborative step
          </Button>
          <Button
            variant="outlined"
            size="large"
            color="secondary"
            sx={{ border: "3px dashed", width: "240px" }}
            onClick={() => {
              setShowWebhook(true);
            }}
          >
            Trigger webhook
          </Button>
        </Box>
      ) : (
        <WebhookForm
          formMethods={useFormMethods}
          formIndex={stepsArrayMethods.fields.length - 1}
          expandedStep={expanded}
          handleStepExpansion={handleStageExpansion(
            "webhook" + (stepsArrayMethods.fields.length - 1),
          )}
        />
      )}
      <EvolveFlowForm
        formMethods={useFormMethods}
        expandedStep={expanded}
        handleStepExpansion={handleStageExpansion("EvolveStep")}
      />
    </Box>
  );
};
