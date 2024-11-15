import { Box } from "@mui/material";
import { useState } from "react";

import {
  DiagramPanel,
  FlowConfigDiagramContainer,
  PanelContainer,
  RequestStage,
} from "@/components/ConfigDiagram";
import { RequestFragment, Status } from "@/graphql/generated/graphql";

import { ConfigRequestActionFilterPanel } from "./ConfigRequestActionFilterPanel";
import { ConfigRequestActionPanel } from "./ConfigRequestActionPanel";
import { ConfigRequestStepPanel } from "./ConfigRequestStepPanel";
import { ConfigRequestTriggerPanel } from "./ConfigRequestTriggerPanel";
import { determineRequestStepStatus } from "./determineRequestStepStatus";
import { StageConnectorButton } from "../Stage/StageConnectorButton";
import { StageType } from "../Stage/StageType";

// Interactive diagram for understanding a given request
export const ConfigDiagramRequest = ({ request }: { request: RequestFragment }) => {
  // if the current step has an action, select the action, otherwise select the step
  const [selectedId, setSelectedId] = useState<string | false>(
    request.requestSteps[request.currentStepIndex].status.resultsFinal
      ? "action"
      : "step" + request.currentStepIndex.toString(),
  );

  const finalStepIndex = request.flow.steps.length - 1;
  const finalAction = request.flow.steps[finalStepIndex]?.action ?? null;
  return (
    <FlowConfigDiagramContainer>
      <PanelContainer>
        <DiagramPanel>
          <RequestStage
            key="trigger0"
            type={StageType.Trigger}
            flow={request.flow}
            id={"trigger0"}
            status={Status.Completed}
            setSelectedId={setSelectedId}
            selectedId={selectedId}
          />
          {request.flow.steps.map((step, index) => {
            if (step.fieldSet.fields.length === 0) return null;

            return (
              <Box key={index}>
                <StageConnectorButton key={"connector-" + index.toString()} />
                <RequestStage
                  type={StageType.Step}
                  step={step}
                  status={determineRequestStepStatus(
                    index,
                    request.requestSteps[index]?.status?.resultsFinal ?? false,
                    request.currentStepIndex,
                    request.final,
                  )}
                  key={"stage-" + step?.id}
                  id={"step" + index.toString()}
                  setSelectedId={setSelectedId}
                  selectedId={selectedId}
                />
                <RequestStage
                  type={StageType.ActionFilter}
                  action={step.action}
                  status={undefined}
                  key={"actionFilter-" + step?.id}
                  id={"actionFilter" + index.toString()}
                  setSelectedId={setSelectedId}
                  selectedId={selectedId}
                />
              </Box>
            );
          })}
          {finalAction && (
            <>
              <StageConnectorButton key={"connector-final"} />
              <RequestStage
                status={
                  request.requestSteps[finalStepIndex]?.actionExecution?.status ??
                  (request.final ? Status.Cancelled : Status.NotAttempted)
                }
                type={StageType.Action}
                action={finalAction}
                id={"action"}
                setSelectedId={setSelectedId}
                selectedId={selectedId}
              />
            </>
          )}
        </DiagramPanel>
      </PanelContainer>
      {selectedId === "trigger0" && <ConfigRequestTriggerPanel request={request} />}
      {request.flow.steps.map((step, index) => {
        return (
          selectedId === "step" + index.toString() && (
            <ConfigRequestStepPanel
              key={"steppanel-" + step?.id}
              step={step}
              requestStep={request.requestSteps[index]}
              requestStepIndex={index}
              currentStepIndex={request.currentStepIndex}
              requestFinal={request.final}
              creator={request.creator}
            />
          )
        );
      })}
      {request.flow.steps.map((step, index) => {
        return (
          selectedId === "actionFilter" + index.toString() && (
            <ConfigRequestActionFilterPanel
              key={"actionFilterpanel-" + step?.id}
              action={step.action}
            />
          )
        );
      })}
      {selectedId === "action" && finalAction && (
        <ConfigRequestActionPanel
          action={finalAction}
          actionExecution={request.requestSteps[finalStepIndex]?.actionExecution ?? null}
          group={request.flow.group}
        />
      )}
    </FlowConfigDiagramContainer>
  );
};
