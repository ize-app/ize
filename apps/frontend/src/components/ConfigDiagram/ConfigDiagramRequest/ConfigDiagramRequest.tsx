import Diversity3Outlined from "@mui/icons-material/Diversity3Outlined";
import PlayCircleOutlineOutlined from "@mui/icons-material/PlayCircleOutlineOutlined";
import { Box } from "@mui/material";
import { useState } from "react";

import { actionProperties } from "@/components/Action/actionProperties";
import { getActionLabel } from "@/components/Action/getActionLabel";
import {
  DiagramPanel,
  FlowConfigDiagramContainer,
  PanelContainer,
  RequestStage,
} from "@/components/ConfigDiagram";
import { getResultLabel } from "@/components/result/getResultLabel";
import { RequestFragment, Status } from "@/graphql/generated/graphql";

import { ConfigRequestActionPanel } from "./ConfigRequestActionPanel";
import { ConfigRequestStepPanel } from "./ConfigRequestStepPanel";
import { ConfigRequestTriggerPanel } from "./ConfigRequestTriggerPanel";
import { determineRequestStepStatus } from "./determineRequestStepStatus";
import { StageConnectorButton } from "../DiagramPanel/StageConnectorButton";

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
            label="Trigger"
            key="trigger0"
            id={"trigger0"}
            status={Status.Completed}
            setSelectedId={setSelectedId}
            selectedId={selectedId}
            icon={PlayCircleOutlineOutlined}
            entities={request.flow.trigger.permission.entities}
          />
          {request.flow.steps.map((step, index) => {
            if (step.fieldSet.fields.length === 0) return null;
            return (
              <Box key={index}>
                <StageConnectorButton key={"connector-" + index.toString()} />
                <RequestStage
                  status={determineRequestStepStatus(
                    index,
                    request.requestSteps[index].status.resultsFinal ?? false,
                    request.currentStepIndex,
                    request.final,
                  )}
                  subtitle={step.fieldSet.fields[0].name}
                  icon={Diversity3Outlined}
                  label={getResultLabel({ type: "resultConfig", result: step.result[0] })}
                  key={"stage-" + step?.id}
                  id={"step" + index.toString()}
                  setSelectedId={setSelectedId}
                  selectedId={selectedId}
                  entities={step.response?.permission.entities}
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
                label={getActionLabel(finalAction, request.flow.group)}
                id={"action"}
                setSelectedId={setSelectedId}
                selectedId={selectedId}
                icon={actionProperties[finalAction.__typename].icon}
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
              triggeringAction={index > 0 ? request.flow.steps[index - 1].action : null}
              requestFinal={request.final}
              creator={request.creator}
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
