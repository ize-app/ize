import { Box } from "@mui/material";
import { useFormContext } from "react-hook-form";

import { PermissionForm } from "./PermissionForm";
import { TriggerFieldsForm } from "./TriggerFieldsForm";
import { PanelAccordion } from "../../../ConfigDiagram/ConfigPanel/PanelAccordion";
import { Switch } from "../../formFields";
import { FlowSchemaType } from "../formValidation/flow";

interface TriggerFormProps {
  show: boolean;
}

export const TriggerForm = ({ show }: TriggerFormProps) => {
  const { formState, watch } = useFormContext<FlowSchemaType>();
  const permissionsError = formState.errors.trigger;
  const fieldsError = formState.errors.fieldSet;

  const isReusable = watch(`reusable`);
  return (
    <Box sx={{ display: show ? "block" : "none" }}>
      <Box sx={{ padding: "16px" }}>
        <Switch<FlowSchemaType> name={`reusable`} label="Flow can be reused" />
      </Box>
      {isReusable && (
        <>
          <PanelAccordion title="Permission" hasError={!!permissionsError}>
            <PermissionForm<FlowSchemaType> fieldName={`trigger.permission`} branch={"request"} />
          </PanelAccordion>
          <PanelAccordion title="Request fields" hasError={!!fieldsError?.fields}>
            <TriggerFieldsForm />
          </PanelAccordion>
        </>
      )}
    </Box>
  );
};
