import { Box } from "@mui/material";
import { UseFormReturn, useFieldArray } from "react-hook-form";

import { PermissionForm } from "./PermissionForm";
import { TriggerFieldsForm } from "./TriggerFieldsForm";
import { PanelAccordion } from "../../../ConfigDiagram/ConfigPanel/PanelAccordion";
import { Switch } from "../../formFields";
import { FlowSchemaType } from "../formValidation/flow";

interface TriggerFormProps {
  formMethods: UseFormReturn<FlowSchemaType>;
  formIndex: number; // react-hook-form name
  show: boolean;
}

export const TriggerForm = ({ formMethods, formIndex, show }: TriggerFormProps) => {
  const permissionsError = formMethods.formState.errors.trigger;
  const fieldsError = formMethods.formState.errors.fieldSet;

  const isReusable = formMethods.watch(`reusable`);

  const fieldsArrayMethods = useFieldArray({
    control: formMethods.control,
    name: `steps.${formIndex}.fieldSet.fields`,
  });

  return (
    formIndex === 0 && (
      <Box sx={{ display: show ? "block" : "none" }}>
        <Box sx={{ padding: "16px" }}>
          <Switch<FlowSchemaType>
            name={`reusable`}
            control={formMethods.control}
            label="Flow can be reused"
          />
        </Box>
        {isReusable && (
          <>
            <PanelAccordion title="Permission" hasError={!!permissionsError}>
              <PermissionForm<FlowSchemaType> fieldName={`trigger.permission`} branch={"request"} />
            </PanelAccordion>
            <PanelAccordion title="Request fields" hasError={!!fieldsError?.fields}>
              <TriggerFieldsForm
                formIndex={formIndex}
                branch={"request"}
                formMethods={formMethods}
                //@ts-expect-error TODO
                fieldsArrayMethods={fieldsArrayMethods}
              />
            </PanelAccordion>
          </>
        )}
      </Box>
    )
  );
};
