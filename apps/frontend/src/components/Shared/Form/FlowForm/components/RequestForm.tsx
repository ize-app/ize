import { NewFlowFormFields } from "@/components/NewFlow/newFlowWizard";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { StepComponentContainer } from "./StepContainer";
import { ResponsiveFormRow } from "./ResponsiveFormRow";
import { RoleSearch, Select, Switch } from "../../FormFields";
import {
  InputDataType,
  PreviousStepResult,
  RequestPermissionType,
  RespondPermissionType,
  StepType,
} from "../types";
import { Box, Button } from "@mui/material";
import { RequestInputsForm } from "./RequestInputsForm";

interface RequestFormProps {
  formMethods: UseFormReturn<NewFlowFormFields>;
  formIndex: number; // react-hook-form name
  previousStepResult: PreviousStepResult | null;
}
export const RequestForm = ({ formMethods, formIndex, previousStepResult }: RequestFormProps) => {
  const isAgentRespondTrigger =
    formMethods.watch(`steps.${formIndex}.respond.permission.type`) ===
    RespondPermissionType.Agents;

  const requestInputFormMethods = useFieldArray({
    control: formMethods.control,
    name: `steps.${formIndex}.request.inputs`,
  });

  const inputs = formMethods.watch(`steps.${formIndex}.request.inputs`);

  const hasRequestInputs =
    (formMethods.watch(`steps.${formIndex}.request.inputs`) ?? []).length > 0;
  return (
    <StepComponentContainer label="How does this flow get triggered??">
      {formIndex === 0 && (
        <>
          <ResponsiveFormRow>
            <Select
              control={formMethods.control}
              width="300px"
              name={`steps.${formIndex}.request.permission.type`}
              selectOptions={[
                { name: "Certain individuals and groups", value: RequestPermissionType.Agents },
                { name: "Anyone", value: RequestPermissionType.Anyone },
              ]}
              label="Who can make requests?"
            />

            {isAgentRespondTrigger && (
              <RoleSearch
                ariaLabel={"Individuals and groups who can make requests"}
                name={`steps.${formIndex}.request.permission.agents`}
                control={formMethods.control}
                setFieldValue={formMethods.setValue}
                getFieldValues={formMethods.getValues}
              />
            )}
          </ResponsiveFormRow>
          <Box sx={{ width: "100%", display: "flex", gap: "24px" }}>
            {hasRequestInputs ? (
              <RequestInputsForm
                useFormMethods={formMethods}
                formIndex={formIndex}
                //@ts-ignore Not sure why the TS error - types are the same
                requestInputFormMethods={requestInputFormMethods}
              />
            ) : (
              <Button
                variant={"outlined"}
                onClick={() => {
                  requestInputFormMethods.append({
                    inputId: "newInput." + (inputs ?? []).length,
                    name: "",
                    required: true,
                    dataType: InputDataType.String,
                  });
                }}
              >
                Add required inputs to make a request
              </Button>
            )}
          </Box>
        </>
      )}
    </StepComponentContainer>
  );
};
