import { Typography } from "@mui/material";

import { PanelAccordion } from "@/components/ConfigDiagram";
import { StepFragment } from "@/graphql/generated/graphql";
import { intervalToIntuitiveTimeString } from "@/utils/inputs";

import { Permissions } from "../Permissions";

export const RespondPermissionPanel = ({
  step,
  initialOpenState = true,
}: {
  step: StepFragment;
  initialOpenState?: boolean;
}) => {
  if (!step.response) return <Typography>No response required</Typography>; //|| step.fieldSet.fields.every((field) => field.isInternal) ;

  const { permission, expirationSeconds, allowMultipleResponses, canBeManuallyEnded } =
    step.response;

  return (
    <PanelAccordion title="Respond permission" hasError={false} initialState={initialOpenState}>
      <Permissions permission={permission} type="response" />
      <Typography>
        Respondants have {intervalToIntuitiveTimeString(expirationSeconds * 1000)} to respond and
        can respond
        {allowMultipleResponses ? " multiple times" : " only once"}
      </Typography>

      {canBeManuallyEnded && <Typography>Triggerer can end the response period early</Typography>}
    </PanelAccordion>
  );
};
