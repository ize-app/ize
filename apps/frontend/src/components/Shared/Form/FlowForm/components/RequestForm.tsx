import { NewFlowFormFields } from "@/components/NewFlow/newFlowWizard";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { StepComponentContainer } from "./StepContainer";
import { ResponsiveFormRow } from "./ResponsiveFormRow";
import { RoleSearch, Select, Switch } from "../../FormFields";
import { InputDataType, PreviousStepResult, PermissionType } from "../types";
import { Box, Button } from "@mui/material";
import { RequestFieldsForm } from "./RequestFieldsForm";
import { FieldDataType, FieldType } from "@/graphql/generated/graphql";
import { FieldSchemaType } from "../formValidation/fields";

interface RequestFormProps {
  formMethods: UseFormReturn<NewFlowFormFields>;
  formIndex: number; // react-hook-form name
  previousStepResult: PreviousStepResult | null;
}

export const defaultRequestField = {
  fieldId: "",
  type: FieldType.FreeInput,
  name: "",
  required: true,
  freeInputDataType: FieldDataType.String,
} as FieldSchemaType;

export const RequestForm = ({ formMethods, formIndex, previousStepResult }: RequestFormProps) => {
  const isEntitiesRequestTrigger =
    formMethods.watch(`steps.${formIndex}.request.permission.type`) === PermissionType.Entities;

  const requestInputFormMethods = useFieldArray({
    control: formMethods.control,
    name: `steps.${formIndex}.request.fields`,
  });

  const inputs = formMethods.watch(`steps.${formIndex}.request.fields`);

  const hasRequestInputs =
    (formMethods.watch(`steps.${formIndex}.request.fields`) ?? []).length > 0;
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
                { name: "Certain individuals and groups", value: PermissionType.Entities },
                { name: "Anyone", value: PermissionType.Anyone },
              ]}
              label="Who can make requests?"
            />

            {isEntitiesRequestTrigger && (
              <RoleSearch
                key="requestRoleSearch"
                ariaLabel={"Individuals and groups who can make requests"}
                name={`steps.${formIndex}.request.permission.entities`}
                control={formMethods.control}
                setFieldValue={formMethods.setValue}
                getFieldValues={formMethods.getValues}
              />
            )}
          </ResponsiveFormRow>
          <Box sx={{ width: "100%", display: "flex", gap: "24px" }}>
            {hasRequestInputs ? (
              <RequestFieldsForm
                useFormMethods={formMethods}
                formIndex={formIndex}
                //@ts-ignore Not sure why the TS error - types are the same
                requestInputFormMethods={requestInputFormMethods}
              />
            ) : (
              <Button
                variant={"outlined"}
                onClick={() => {
                  requestInputFormMethods.append(defaultRequestField);
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
