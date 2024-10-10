import { Box, Typography } from "@mui/material";

import { AvatarWithName } from "@/components/Avatar";
import { ConfigurationPanel, PanelAccordion, PanelContainer } from "@/components/ConfigDiagram";
import { Fields } from "@/components/Field/Fields";
import { EntityFragment, RequestStepFragment, StepFragment } from "@/graphql/generated/graphql";

export const ConfigRequestTriggerPanel = ({
  step,
  requestStep,
  creator,
}: {
  step: StepFragment;
  requestStep: RequestStepFragment;
  creator: EntityFragment;
}) => {
  return (
    <PanelContainer>
      {/* <PanelHeader>
        <Typography color="primary" variant="label">
          Trigger configuration
        </Typography>
      </PanelHeader> */}
      <ConfigurationPanel>
        <PanelAccordion title="Trigger permission" hasError={false}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography>Created by: </Typography>
            <AvatarWithName avatar={creator} />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography>Created at: </Typography>
            <Typography>{new Date(requestStep.createdAt).toLocaleString()}</Typography>
          </Box>
        </PanelAccordion>
        {step.request.fields.length > 0 && (
          <PanelAccordion title="Request fields" hasError={false}>
            <Fields fields={step.request.fields} fieldAnswers={requestStep.requestFieldAnswers} />
          </PanelAccordion>
        )}
      </ConfigurationPanel>
    </PanelContainer>
  );
};
