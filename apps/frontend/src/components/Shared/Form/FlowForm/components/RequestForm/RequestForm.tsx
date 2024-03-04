import { UseFormReturn, useFieldArray } from "react-hook-form";
import { StepComponentContainer } from "../StepContainer";
import { ResponsiveFormRow } from "../ResponsiveFormRow";
import { RoleSearch, Select, Switch } from "../../../FormFields";
import { PermissionType } from "../../formValidation/permission";
import { Box, Button } from "@mui/material";
import { RequestFieldsForm } from "./RequestFieldsForm";
import { FieldDataType, FieldType } from "@/graphql/generated/graphql";
import { FieldSchemaType } from "../../formValidation/fields";
import { FlowSchemaType } from "../../formValidation/flow";
import { FieldsForm } from "../FieldsForm";

interface RequestFormProps {
  formMethods: UseFormReturn<FlowSchemaType>;
  formIndex: number; // react-hook-form name
}

export const defaultRequestField: FieldSchemaType = {
  fieldId: "",
  type: FieldType.FreeInput,
  name: "",
  required: true,
  freeInputDataType: FieldDataType.String,
} as FieldSchemaType;

export const RequestForm = ({ formMethods, formIndex }: RequestFormProps) => {
  const isEntitiesRequestTrigger =
    formMethods.watch(`steps.${formIndex}.request.permission.type`) === PermissionType.Entities;

  const fieldsArrayMethods = useFieldArray({
    control: formMethods.control,
    name: `steps.${formIndex}.request.fields`,
  });

  const hasRequestInputs =
    (formMethods.watch(`steps.${formIndex}.request.fields`) ?? []).length > 0;
  return (
    <StepComponentContainer label="Request">
      {formIndex === 0 && (
        <>
          <ResponsiveFormRow>
            <Select
              control={formMethods.control}
              width="300px"
              name={`steps.${formIndex}.request.permission.type`}
              selectOptions={[
                { name: "Certain individuals and groups", value: PermissionType.Entities },
                { name: "Anyone can request", value: PermissionType.Anyone },
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
              <FieldsForm
                formIndex={formIndex}
                branch={"request"}
                useFormMethods={formMethods}
                //@ts-ignore
                fieldsArrayMethods={fieldsArrayMethods}
              />
            ) : (
              <Button
                variant={"outlined"}
                onClick={() => {
                  fieldsArrayMethods.append(defaultRequestField);
                }}
              >
                Add field
              </Button>
            )}
          </Box>
        </>
      )}
    </StepComponentContainer>
  );
};
