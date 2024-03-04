import { UseFormReturn } from "react-hook-form";
import { StepComponentContainer } from "./StepContainer";
import { ResponsiveFormRow } from "./ResponsiveFormRow";
import { RoleSearch, Select } from "../../FormFields";
import { PermissionType } from "../formValidation/permission";
import { Box } from "@mui/material";
import { FieldDataType, FieldType } from "@/graphql/generated/graphql";
import { FieldSchemaType } from "../formValidation/fields";
import { FlowSchemaType } from "../formValidation/flow";
import { FieldsForm } from "./FieldsForm";

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
            <FieldsForm formIndex={formIndex} branch={"request"} useFormMethods={formMethods} />
          </Box>
        </>
      )}
    </StepComponentContainer>
  );
};
