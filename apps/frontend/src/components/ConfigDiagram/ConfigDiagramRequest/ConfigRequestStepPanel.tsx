import { Box, Typography } from "@mui/material";
import { useContext } from "react";

import { ConfigurationPanel, PanelAccordion, PanelContainer } from "@/components/ConfigDiagram";
import { EndRequestStepButton } from "@/components/EndRequestStepButton";
import { RequestStepResults } from "@/components/result/Results";
import { StatusTag } from "@/components/status/StatusTag";
import {
  ActionFragment,
  EntityFragment,
  RequestStepFragment,
  StepFragment,
} from "@/graphql/generated/graphql";
import { CurrentUserContext } from "@/hooks/contexts/current_user_context";

import { determineRequestStepStatus } from "./determineRequestStepStatus";
import { remainingTimeToRespond } from "./remainingTimeToRespond";
import { TimeLeft } from "./TimeLeft";
import { ActionFilter } from "../../Action/ActionFilter";
import { RespondPermissionPanel } from "../RespondPermissionPanel";

export const ConfigRequestStepPanel = ({
  step,
  requestStep,
  triggeringAction,
  requestStepIndex,
  currentStepIndex,
  requestFinal,
  creator,
}: {
  step: StepFragment;
  requestFinal: boolean;
  requestStep: RequestStepFragment | null;
  triggeringAction: ActionFragment | null | undefined;
  requestStepIndex: number;
  currentStepIndex: number;
  creator: EntityFragment;
}) => {
  const { me } = useContext(CurrentUserContext);

  const userIsCreator =
    me?.user.entityId === creator.entityId ||
    me?.identities.some((i) => i.entityId === creator.entityId);

  const status = determineRequestStepStatus(
    requestStepIndex,
    requestStep?.resultsComplete ?? false,
    currentStepIndex,
    requestFinal,
  );
  let remainingTime: number | null = null;
  let expirationDate: Date | null = null;

  const showManuallyEndButton =
    step.canBeManuallyEnded && userIsCreator && !requestStep?.responseComplete;

  if (requestStep) {
    expirationDate = new Date(requestStep.expirationDate);
    remainingTime = remainingTimeToRespond({
      expirationDate,
    });
  }

  return (
    <PanelContainer>
      {/* <PanelHeader>
        <Typography color="primary" variant="label">
          Step configuration
        </Typography>{" "}
      </PanelHeader> */}
      <ConfigurationPanel>
        <PanelAccordion title="Status" hasError={false}>
          {showManuallyEndButton && requestStep && (
            <EndRequestStepButton requestStepId={requestStep.requestStepId} />
          )}
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography>Status </Typography>
            <StatusTag status={status} />
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
          {requestStep && !requestStep.responseComplete && remainingTime && remainingTime > 0 && (
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography>Remaining time to respond </Typography>
              <TimeLeft msLeft={remainingTime} />
            </Box>
          )}
        </PanelAccordion>
        {triggeringAction && triggeringAction.filterOption && (
          <PanelAccordion title="Filter" hasError={false}>
            <ActionFilter action={triggeringAction} />
          </PanelAccordion>
        )}
        <RespondPermissionPanel step={step} initialOpenState={false} />
        <PanelAccordion title="Collaborations 👀" hasError={false}>
          {/* <ResultConfigs resultConfigs={step.result} responseFields={step.response.fields} /> */}
          <RequestStepResults
            resultConfigs={step.result}
            responseFields={requestStep?.responseFields ?? step.response.fields}
            results={requestStep?.results ?? []}
            requestStatus={status}
          />
        </PanelAccordion>
      </ConfigurationPanel>
    </PanelContainer>
  );
};
