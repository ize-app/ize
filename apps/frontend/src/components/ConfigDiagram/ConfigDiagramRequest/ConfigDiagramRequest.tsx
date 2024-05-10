import {
  FlowConfigDiagramContainer,
  DiagramPanel,
  PanelContainer,
  RequestStage,
} from "@/components/ConfigDiagram";
import PlayCircleOutlineOutlined from "@mui/icons-material/PlayCircleOutlineOutlined";
import { Box } from "@mui/material";
import { useState } from "react";
import { StageConnectorButton } from "../DiagramPanel/StageConnectorButton";
import { RequestFragment } from "@/graphql/generated/graphql";
import Diversity3Outlined from "@mui/icons-material/Diversity3Outlined";
import { ConfigFlowActionPanel } from "../ConfigDiagramFlow/ConfigFlowActionPanel";
import { RequestStatus } from "@/components/status/RequestStatus/type";
import { ConfigRequestTriggerPanel } from "./ConfigRequestTriggerPanel";
import { ConfigRequestStepPanel } from "./ConfigRequestStepPanel";
import { determineRequestStepStatus } from "./determineRequestStepStatus";
import { ConfigRequestActionPanel } from "./ConfigRequestActionPanel";
import { actionProperties } from "@/components/Action/actionProperties";
import { get } from "http";
import { getActionLabel } from "@/components/Action/getActionLabel";

// Interactive diagram for understanding a given request
export const ConfigDiagramRequest = ({ request }: { request: RequestFragment }) => {
  const [selectedId, setSelectedId] = useState<string | false>("trigger0"); // change to step1
  const finalStepIndex = request.flow.steps.length - 1;
  const finalAction = request.flow.steps[finalStepIndex]?.action ?? null;

  console.log("request is", request);

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {/* <PanelHeader>Header</PanelHeader> */}
      <FlowConfigDiagramContainer>
        <PanelContainer>
          {/* <PanelHeader>Header</PanelHeader> */}
          <DiagramPanel>
            <RequestStage
              label="Trigger"
              key="trigger0"
              id={"trigger0"}
              status={RequestStatus.Completed}
              setSelectedId={setSelectedId}
              selectedId={selectedId}
              icon={PlayCircleOutlineOutlined}
              entities={request.flow.steps[0].request.permission.entities}
            />
            <StageConnectorButton />
            {request.flow.steps.map((step, index) => {
              return (
                <Box key={index}>
                  <RequestStage
                    status={determineRequestStepStatus(
                      index,
                      request.steps[index]?.resultsComplete ?? false,
                      request.currentStepIndex,
                    )}
                    icon={Diversity3Outlined}
                    label={
                      request.flow.steps[0].result[0]
                        ? request.flow.steps[0].result[0].__typename
                        : "Collaboration " + (index + 1).toString()
                    }
                    key={"stage-" + step?.id}
                    id={"step" + index.toString()}
                    setSelectedId={setSelectedId}
                    selectedId={selectedId}
                    entities={request.flow.steps[0].response.permission.entities}
                  />
                  {index < finalStepIndex && (
                    <StageConnectorButton key={"connector-" + index.toString()} />
                  )}
                </Box>
              );
            })}
            {finalAction && (
              <>
                <StageConnectorButton key={"connector-final"} />
                <RequestStage
                  status={RequestStatus.Pending}
                  label={actionProperties[finalAction.__typename].label}
                  id={"action"}
                  setSelectedId={setSelectedId}
                  selectedId={selectedId}
                  icon={actionProperties[finalAction.__typename].icon}
                />
              </>
            )}
          </DiagramPanel>
        </PanelContainer>
        {selectedId === "trigger0" && (
          <ConfigRequestTriggerPanel
            step={request.flow.steps[0]}
            requestStep={request.steps[0]}
            creator={request.creator}
          />
        )}
        {request.flow.steps.map((step, index) => {
          return (
            selectedId === "step" + index.toString() && (
              <ConfigRequestStepPanel
                key={"steppanel-" + step?.id}
                step={step}
                requestStep={request.steps[index]}
                requestStepIndex={index}
                currentStepIndex={request.currentStepIndex}
                triggeringAction={index > 0 ? request.flow.steps[index - 1].action : null}
              />
            )
          );
        })}
        {selectedId === "action" && finalAction && (
          <ConfigRequestActionPanel
            action={finalAction}
            actionExecution={request.steps[finalStepIndex]?.actionExecution ?? null}
          />
        )}
      </FlowConfigDiagramContainer>
    </Box>
  );
};
