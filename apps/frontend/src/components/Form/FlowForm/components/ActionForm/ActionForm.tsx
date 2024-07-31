import { Box, FormHelperText } from "@mui/material";
import { UseFormReturn } from "react-hook-form";

import { ActionDescription } from "@/components/Action/ActionDescription";
import { TextField } from "@/components/Form/formFields";
import { ActionType } from "@/graphql/generated/graphql";

import { WebhookForm } from "./WebhookForm";
import { PanelAccordion } from "../../../../ConfigDiagram/ConfigPanel/PanelAccordion";
import { ActionSchemaType } from "../../formValidation/action";
import { FlowSchemaType } from "../../formValidation/flow";
import { ActionFilterForm } from "../ActionFilterForm";

interface ActionFormProps {
  formMethods: UseFormReturn<FlowSchemaType>;
  formIndex: number; // react-hook-form name
  show: boolean;
  action: ActionSchemaType;
}

export const ActionForm = ({ formMethods, formIndex, show, action }: ActionFormProps) => {
  const actionError = formMethods.formState.errors.steps?.[formIndex]?.action;

  return (
    <Box sx={{ display: show ? "box" : "none" }}>
      <TextField<FlowSchemaType>
        name={`steps.${formIndex}.action.locked`}
        key={"step" + formIndex.toString() + "actionLocked"}
        control={formMethods.control}
        label="fieldId"
        disabled={true}
        display={false}
        defaultValue=""
      />
      <ActionFilterForm formMethods={formMethods} formIndex={formIndex} action={action} />
      <PanelAccordion title="Setup" hasError={!!actionError}>
        <ActionDescription actionType={action.type} groupName="the group" />
        {!!actionError?.root && (
          <FormHelperText
            sx={{
              color: "error.main",
            }}
          >
            {actionError.root?.message}
          </FormHelperText>
        )}
        {action.type === ActionType.CallWebhook && (
          <WebhookForm formMethods={formMethods} formIndex={formIndex} />
        )}
      </PanelAccordion>
    </Box>
  );
};
