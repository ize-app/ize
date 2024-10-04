import { Box, Typography } from "@mui/material";

import { ConfigurationPanel, PanelAccordion, PanelContainer } from "@/components/ConfigDiagram";
import { RequestStepResults } from "@/components/result/Results";
import { StatusTag } from "@/components/status/StatusTag";
import { ActionFragment, RequestStepFragment, StepFragment } from "@/graphql/generated/graphql";
import { intervalToIntuitiveTimeString } from "@/utils/inputs";

import { determineRequestStepStatus } from "./determineRequestStepStatus";
import { remainingTimeToRespond } from "./remainingTimeToRespond";
import { TimeLeft } from "./TimeLeft";
import { ActionFilter } from "../../Action/ActionFilter";
import { Permissions } from "../../Permissions";

export const ConfigRequestStepPanel = ({
  step,
  requestStep,
  triggeringAction,
  requestStepIndex,
  currentStepIndex,
  requestFinal,
}: {
  step: StepFragment;
  requestFinal: boolean;
  requestStep: RequestStepFragment | null;
  triggeringAction: ActionFragment | null | undefined;
  requestStepIndex: number;
  currentStepIndex: number;
}) => {
  const status = determineRequestStepStatus(
    requestStepIndex,
    requestStep?.resultsComplete ?? false,
    currentStepIndex,
    requestFinal,
  );
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
      {/* <PanelHeader>
        <Typography color="primary" variant="label">
          Step configuration
        </Typography>{" "}
      </PanelHeader> */}
      <ConfigurationPanel>
        <PanelAccordion title="Status" hasError={false}>
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
        <PanelAccordion title="Respond permission" hasError={false}>
          {step.response.permission && (
            <Permissions permission={step.response.permission} type="response" />
          )}
          {step.expirationSeconds &&
            `Respondants have ${intervalToIntuitiveTimeString(
              step.expirationSeconds * 1000,
            )} to respond and can respond ${
              step.allowMultipleResponses ? "multiple times" : "only once"
            }`}
        </PanelAccordion>
        <PanelAccordion title="Collaborations 👀" hasError={false}>
          {/* <ResultConfigs resultConfigs={step.result} responseFields={step.response.fields} /> */}
          <RequestStepResults
            resultConfigs={step.result}
            responseFields={step.response.fields}
            results={requestStep?.results ?? []}
            requestStatus={status}
          />
        </PanelAccordion>
      </ConfigurationPanel>
    </PanelContainer>
  );
};
