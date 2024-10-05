import { Typography } from "@mui/material";

import { PanelAccordion } from "@/components/ConfigDiagram";
import { StepFragment } from "@/graphql/generated/graphql";
import { intervalToIntuitiveTimeString } from "@/utils/inputs";

import { Permissions } from "../Permissions";

export const RespondPermissionPanel = ({ step }: { step: StepFragment }) => {
  return (
    <PanelAccordion title="Respond permission" hasError={false}>
      {step.response.permission && (
        <Permissions permission={step.response.permission} type="response" />
      )}
      {step.expirationSeconds && (
        <Typography>
          Respondants have {intervalToIntuitiveTimeString(step.expirationSeconds * 1000)} to respond
          and can respond
          {step.allowMultipleResponses ? "multiple times" : "only once"}
        </Typography>
      )}
      {step.canBeManuallyEnded && (
        <Typography>Triggerer can end the response period early</Typography>
      )}
    </PanelAccordion>
  );
};
