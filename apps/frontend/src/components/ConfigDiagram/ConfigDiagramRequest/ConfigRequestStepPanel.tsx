import { Box, Typography } from "@mui/material";
import { useContext } from "react";

import { ConfigurationPanel, PanelAccordion, PanelContainer } from "@/components/ConfigDiagram";
import { EndRequestStepButton } from "@/components/EndRequestStepButton";
import { RequestStepResults } from "@/components/result/Results";
import { requestStepStatusProps } from "@/components/status/requestStepStatusProps";
import { StatusTag } from "@/components/status/StatusTag";
import {
  EntityFragment,
  RequestStepFragment,
  RequestStepStatus,
  StepFragment,
} from "@/graphql/generated/graphql";
import { CurrentUserContext } from "@/hooks/contexts/current_user_context";

import { remainingTimeToRespond } from "./remainingTimeToRespond";
import { TimeLeft } from "./TimeLeft";
import { RespondPermissionPanel } from "../RespondPermissionPanel";

export const ConfigRequestStepPanel = ({
  step,
  requestStep,
  creator,
}: {
  step: StepFragment;
  requestStep: RequestStepFragment | null;
  creator: EntityFragment;
}) => {
  const { me } = useContext(CurrentUserContext);

  const userIsCreator =
    me?.user.entityId === creator.entityId ||
    me?.identities.some((i) => i.entityId === creator.entityId);

  let remainingTime: number | null = null;
  let expirationDate: Date | null = null;

  const showManuallyEndButton =
    step.response?.canBeManuallyEnded && userIsCreator && !requestStep?.status.responseFinal;

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
          {showManuallyEndButton && requestStep && (
            <EndRequestStepButton requestStepId={requestStep.requestStepId} />
          )}
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
        <PanelAccordion title="Collaborations 👀" hasError={false} initialState={false}>
          {/* <ResultConfigs resultConfigs={step.result} responseFields={step.response.fields} /> */}
          <RequestStepResults requestStep={requestStep} step={step} />
        </PanelAccordion>
      </ConfigurationPanel>
    </PanelContainer>
  );
};
