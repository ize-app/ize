import { UseFormReturn } from "react-hook-form";

import { FlowSchemaType } from "../formValidation/flow";
import { StepComponentContainer } from "./StepContainer";
import { ResponsiveFormRow } from "./ResponsiveFormRow";
import { FieldsForm } from "./FieldsForm";
import { RoleSearch, Select } from "../../FormFields";
import { PermissionType } from "../formValidation/permission";

interface ResponseFieldsFormProps {
  formMethods: UseFormReturn<FlowSchemaType>;
  formIndex: number; // react-hook-form name
}

const requestExpirationOptions = [
  { name: "1 hour", value: 3600 },
  { name: "4 hours", value: 14400 },
  { name: "1 day", value: 86400 },
  { name: "3 days", value: 259200 },
  { name: "7 days", value: 604800 },
  { name: "30 days", value: 2592000 },
];

export const ResponseForm = ({ formMethods, formIndex }: ResponseFieldsFormProps) => {
  const responseTrigger = formMethods.watch(`steps.${formIndex}.response.permission.type`);

  return (
    <StepComponentContainer label={"Response"}>
      <>
        <ResponsiveFormRow>
          <Select<FlowSchemaType>
            control={formMethods.control}
            width="300px"
            name={`steps.${formIndex}.response.permission.type`}
            selectOptions={[
              { name: "Certain people can respond", value: PermissionType.Entities },
              { name: "Anyone can respond", value: PermissionType.Anyone },
              {
                name: "No response: Automatically approve request",
                value: PermissionType.NA,
              },
            ]}
            label="Who can respond?"
            displayLabel={false}
            size="small"
          />

          {responseTrigger === PermissionType.Entities && (
            <RoleSearch<FlowSchemaType>
              key="responseRoleSearch"
              ariaLabel={"Individuals and groups who can respond"}
              name={`steps.${formIndex}.response.permission.entities`}
              control={formMethods.control}
              setFieldValue={formMethods.setValue}
              getFieldValues={formMethods.getValues}
            />
          )}
        </ResponsiveFormRow>
        {responseTrigger !== PermissionType.NA && (
          <>
            <ResponsiveFormRow>
              <Select<FlowSchemaType>
                control={formMethods.control}
                label="How long do people have to respond?"
                width="300px"
                renderValue={(val) => {
                  const option = requestExpirationOptions.find((option) => option.value === val);
                  return option?.name + " to respond";
                }}
                selectOptions={requestExpirationOptions}
                name={`steps.${formIndex}.expirationSeconds`}
                displayLabel={false}
                size={"small"}
              />
            </ResponsiveFormRow>
            <ResponsiveFormRow>
              <FieldsForm formIndex={formIndex} branch={"response"} useFormMethods={formMethods} />
            </ResponsiveFormRow>
          </>
        )}
      </>
    </StepComponentContainer>
  );
};
