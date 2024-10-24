import { Box, Typography } from "@mui/material";
import { useFormContext } from "react-hook-form";

import { PermissionForm } from "./PermissionForm";
import { TriggerFieldsForm } from "./TriggerFieldsForm";
import { PanelAccordion } from "../../../ConfigDiagram/ConfigPanel/PanelAccordion";
import { FlowSchemaType } from "../formValidation/flow";

interface TriggerFormProps {
  show: boolean;
  isReusable: boolean;
}

export const TriggerForm = ({ show, isReusable }: TriggerFormProps) => {
  const { formState } = useFormContext<FlowSchemaType>();
  const permissionsError = formState.errors.trigger;
  const fieldsError = formState.errors.fieldSet;

  // const isReusable = watch(`reusable`);
  console.log("trigger form isReusable", isReusable);

  return (
    <Box sx={{ display: show ? "block" : "none" }}>
      {isReusable ? (
        <>
          <PanelAccordion title="Permission" hasError={!!permissionsError}>
            <PermissionForm<FlowSchemaType> fieldName={`trigger.permission`} branch={"request"} />
          </PanelAccordion>
          <PanelAccordion title="Request fields" hasError={!!fieldsError?.fields}>
            <TriggerFieldsForm />
          </PanelAccordion>
        </>
      ) : (
        <Typography variant="body2" sx={{ padding: "16px" }}>
          Flow will automatically be triggered once flow is created
        </Typography>
      )}
    </Box>
  );
};
