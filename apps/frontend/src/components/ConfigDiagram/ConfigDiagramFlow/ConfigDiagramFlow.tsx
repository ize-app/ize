import Diversity3Outlined from "@mui/icons-material/Diversity3Outlined";
import PlayCircleOutlineOutlined from "@mui/icons-material/PlayCircleOutlineOutlined";
import { Box } from "@mui/material";
import { useState } from "react";

import { actionProperties } from "@/components/Action/actionProperties";
import { getActionLabel } from "@/components/Action/getActionLabel";
import {
  DiagramPanel,
  FlowConfigDiagramContainer,
  FlowStage,
  PanelContainer,
} from "@/components/ConfigDiagram";
import { resultTypeDisplay } from "@/components/result/resultTypeDisplay";
import { FlowFragment } from "@/graphql/generated/graphql";

import { ConfigFlowActionPanel } from "./ConfigFlowActionPanel";
import { ConfigFlowTriggerPanel } from "./ConfigFlowTriggerPanel";
import { ConfigStepPanel } from "./ConfigStepPanel";
import { StageConnectorButton } from "../DiagramPanel/StageConnectorButton";

// Interactive diagram for understanding flow config
// does not allow  user to edit config
export const ConfigDiagramFlow = ({ flow }: { flow: FlowFragment }) => {
  const [selectedId, setSelectedId] = useState<string | false>("trigger0"); // change to step1

  const finalStepIndex = flow.steps.length - 1;
  const finalAction = flow.steps[finalStepIndex]?.action ?? null;
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {/* <PanelHeader>Header</PanelHeader> */}
      <FlowConfigDiagramContainer>
        <PanelContainer>
          {/* <PanelHeader>Header</PanelHeader> */}
          <DiagramPanel>
            <FlowStage
              label="Trigger"
              key="trigger0"
              id={"trigger0"}
              setSelectedId={setSelectedId}
              selectedId={selectedId}
              icon={PlayCircleOutlineOutlined}
              entities={flow.steps[0].request.permission?.entities}
            />
            {flow.steps.map((step, index) => {
              if (step.response.fields.length === 0) return null;
              return (
                <Box key={index}>
                  <StageConnectorButton key={"connector-" + index.toString()} />
                  <FlowStage
                    icon={Diversity3Outlined}
                    label={
                      flow.steps[index].result[0]
                        ? resultTypeDisplay[flow.steps[index].result[0].__typename]
                        : "Collaboration " + (index + 1).toString()
                    }
                    key={"stage-" + step?.id}
                    hasError={false}
                    id={"step" + index.toString()}
                    setSelectedId={setSelectedId}
                    selectedId={selectedId}
                    entities={flow.steps[index].response.permission?.entities}
                  />
                </Box>
              );
            })}
            {finalAction && (
              <>
                <StageConnectorButton key={"connector-final"} />
                <FlowStage
                  hasError={false}
                  label={getActionLabel(finalAction, flow.group)}
                  id={"action"}
                  setSelectedId={setSelectedId}
                  selectedId={selectedId}
                  icon={actionProperties[finalAction.__typename].icon}
                />
              </>
            )}
          </DiagramPanel>
        </PanelContainer>
        {selectedId === "trigger0" && <ConfigFlowTriggerPanel step={flow.steps[0]} />}
        {flow.steps.map((step, index) => {
          return (
            selectedId === "step" + index.toString() && (
              <ConfigStepPanel
                key={"steppanel-" + step?.id}
                step={step}
                triggeringAction={index > 0 ? flow.steps[index - 1].action : null}
              />
            )
          );
        })}
        {selectedId === "action" && finalAction && (
          <ConfigFlowActionPanel action={finalAction} group={flow.group} />
        )}
      </FlowConfigDiagramContainer>
    </Box>
  );
};
