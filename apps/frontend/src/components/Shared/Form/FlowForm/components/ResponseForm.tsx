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

export const ResponseForm = ({ formMethods, formIndex }: ResponseFieldsFormProps) => {
  const isEntitiesRespondTrigger =
    formMethods.watch(`steps.${formIndex}.response.permission.type`) === PermissionType.Entities;
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
            ]}
            label="Who can respond?"
            displayLabel={false}
            size="small"
          />

          {isEntitiesRespondTrigger && (
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
        <ResponsiveFormRow>
          <FieldsForm formIndex={formIndex} branch={"response"} useFormMethods={formMethods} />
        </ResponsiveFormRow>
      </>
    </StepComponentContainer>
  );
};
