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
import { ConfigStepPanel } from "../ConfigDiagramFlow/ConfigStepPanel";
import { ConfigActionPanel } from "../ConfigDiagramFlow/ConfigActionPanel";
import { RequestStageStatus } from "../DiagramPanel/RequestStage";
import { ConfigRequestTriggerPanel } from "./ConfigRequestTriggerPanel";

const determineStepStatus = (stepIndex: number, currentStepIndex: number) => {
  if (stepIndex === currentStepIndex) return RequestStageStatus.InProgress;
  else if (stepIndex > currentStepIndex) return RequestStageStatus.Completed;
  else return RequestStageStatus.Pending;
};

// Interactive diagram for understanding a given request
export const ConfigDiagramRequest = ({ request }: { request: RequestFragment }) => {
  const [selectedId, setSelectedId] = useState<string | false>("trigger0"); // change to step1
  const finalStepIndex = request.flow.steps.length - 1;
  const finalAction = request.flow.steps[finalStepIndex]?.action ?? null;

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
              status={RequestStageStatus.Completed}
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
                    status={determineStepStatus(index, request.currentStepIndex)}
                    icon={Diversity3Outlined}
                    label={request.flow.steps[0].result[0].__typename} //"Collaboration " + (index + 1).toString()
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
                  status={RequestStageStatus.Pending}
                  label={finalAction.__typename}
                  id={"action"}
                  setSelectedId={setSelectedId}
                  selectedId={selectedId}
                  //   icon={<PublicOutlinedIcon color="primary" />}
                />
              </>
            )}
          </DiagramPanel>
        </PanelContainer>
        {selectedId === "trigger0" && (
          <ConfigRequestTriggerPanel step={request.flow.steps[0]} requestStep={request.steps[0]} />
        )}
        {request.flow.steps.map((step, index) => {
          return (
            selectedId === "step" + index.toString() && (
              <ConfigStepPanel
                key={"steppanel-" + step?.id}
                step={step}
                triggeringAction={index > 0 ? request.flow.steps[index - 1].action : null}
              />
            )
          );
        })}
        {selectedId === "action" && finalAction && <ConfigActionPanel action={finalAction} />}
      </FlowConfigDiagramContainer>
    </Box>
  );
};
