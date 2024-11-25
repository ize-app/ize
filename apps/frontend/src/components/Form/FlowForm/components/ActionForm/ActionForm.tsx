import { Box, FormHelperText } from "@mui/material";
import { FieldError, useFormContext } from "react-hook-form";

import { ActionDescription } from "@/components/Action/ActionDescription";
import { ActionType } from "@/graphql/generated/graphql";

import { WebhookForm } from "./WebhookForm";
import { PanelAccordion } from "../../../../ConfigDiagram/ConfigPanel/PanelAccordion";
import { ActionSchemaType } from "../../formValidation/action";
import { FlowSchemaType } from "../../formValidation/flow";

interface ActionFormProps {
  stepIndex: number; // react-hook-form name
  show: boolean;
}

export const ActionForm = ({ stepIndex, show }: ActionFormProps) => {
  const { formState, getValues } = useFormContext<FlowSchemaType>();
  const action = getValues(`steps.${stepIndex}.action`) as ActionSchemaType;
  const displayAction =
    action && action.type && action.type !== ActionType.TriggerStep ? true : false;
  if (!displayAction) return null;
  // @ts-expect-error Type inference isn't working here because formstate errors has it's own "type"
  // field so action type union discrimination isn't working
  const actionError = formState.errors.steps?.[stepIndex]?.action?.callWebhook as FieldError;
  return (
    <Box sx={{ display: show ? "box" : "none" }}>
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
          <WebhookForm fieldName={`steps.${stepIndex}.action`} />
        )}
      </PanelAccordion>
    </Box>
  );
};
