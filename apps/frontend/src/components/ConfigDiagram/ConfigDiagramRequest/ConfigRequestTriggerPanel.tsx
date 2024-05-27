import { Box, Typography } from "@mui/material";

import { AvatarWithName } from "@/components/Avatar";
import {
  ConfigurationPanel,
  PanelAccordion,
  PanelContainer,
  PanelHeader,
} from "@/components/ConfigDiagram";
import { Fields } from "@/components/Field/Fields";
import {
  RequestStepFragment,
  StepFragment,
  UserSummaryPartsFragment,
} from "@/graphql/generated/graphql";

export const ConfigRequestTriggerPanel = ({
  step,
  requestStep,
  creator,
}: {
  step: StepFragment;
  requestStep: RequestStepFragment;
  creator: UserSummaryPartsFragment;
}) => {
  return (
    <PanelContainer>
      <PanelHeader>
        <Typography color="primary" variant="label">
          Trigger configuration
        </Typography>
      </PanelHeader>
      <ConfigurationPanel>
        <PanelAccordion title="Trigger permission" hasError={false}>
          {/* <Permissions permission={step.request.permission} type="request" /> */}
          {/* TODO */}
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
