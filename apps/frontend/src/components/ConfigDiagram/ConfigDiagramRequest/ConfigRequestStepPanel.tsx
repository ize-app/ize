import { Box, Typography } from "@mui/material";

import { ConfigurationPanel, PanelAccordion, PanelContainer } from "@/components/ConfigDiagram";
import { RequestStepResults } from "@/components/result/Results";
import { requestStepStatusProps } from "@/components/status/requestStepStatusProps";
import { StatusTag } from "@/components/status/StatusTag";
import { RequestStepFragment, RequestStepStatus, StepFragment } from "@/graphql/generated/graphql";

import { remainingTimeToRespond } from "./remainingTimeToRespond";
import { TimeLeft } from "./TimeLeft";
import { RespondPermissionPanel } from "../RespondPermissionPanel";

export const ConfigRequestStepPanel = ({
  step,
  requestStep,
}: {
  step: StepFragment;
  requestStep: RequestStepFragment | null;
}) => {
  let remainingTime: number | null = null;
  let expirationDate: Date | null = null;

  if (requestStep) {
    expirationDate = new Date(requestStep.expirationDate);
    remainingTime = remainingTimeToRespond({
      expirationDate,
    });
  }

  return (
    <PanelContainer>
      <ConfigurationPanel>
        <PanelAccordion title="Status" hasError={false}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography>Status </Typography>
            <StatusTag
              statusProps={
                requestStepStatusProps[requestStep?.status.status ?? RequestStepStatus.NotStarted]
              }
            />
          </Box>
          {requestStep && (
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography>Started at: </Typography>
              <Typography>{new Date(requestStep.createdAt).toLocaleString()}</Typography>
            </Box>
          )}
          {requestStep && remainingTime && remainingTime < 0 && (
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography>Expired at: </Typography>
              <Typography>{new Date(requestStep?.expirationDate).toLocaleString()}</Typography>
            </Box>
          )}
          {requestStep &&
            !requestStep.status.responseFinal &&
            remainingTime &&
            remainingTime > 0 && (
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Remaining time to respond </Typography>
                <TimeLeft msLeft={remainingTime} />
              </Box>
            )}
        </PanelAccordion>
        <RespondPermissionPanel step={step} initialOpenState={false} />
        <PanelAccordion title="Collaborations 👀" hasError={false} initialState={true}>
          {/* <ResultConfigs resultConfigs={step.result} responseFields={step.response.fields} /> */}
          <RequestStepResults requestStep={requestStep} step={step} />
        </PanelAccordion>
      </ConfigurationPanel>
    </PanelContainer>
  );
};
