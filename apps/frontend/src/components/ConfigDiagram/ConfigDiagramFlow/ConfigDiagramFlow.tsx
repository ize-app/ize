import { Box } from "@mui/material";
import { useState } from "react";

import {
  DiagramPanel,
  FlowConfigDiagramContainer,
  FlowStage,
  PanelContainer,
} from "@/components/ConfigDiagram";
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
              type="trigger"
              flow={flow}
              key="trigger0"
              id={"trigger0"}
              setSelectedId={setSelectedId}
              selectedId={selectedId}
            />
            {flow.steps.map((step, index) => {
              if (step.fieldSet.fields.length === 0) return null;
              return (
                <Box key={index}>
                  <StageConnectorButton key={"connector-" + index.toString()} />
                  <FlowStage
                    type="step"
                    step={step}
                    key={"stage-" + step?.id}
                    id={"step" + index.toString()}
                    setSelectedId={setSelectedId}
                    selectedId={selectedId}
                  />
                </Box>
              );
            })}
            {finalAction && (
              <>
                <StageConnectorButton key={"connector-final"} />
                <FlowStage
                  type="action"
                  action={finalAction}
                  id={"action"}
                  setSelectedId={setSelectedId}
                  selectedId={selectedId}
                />
              </>
            )}
          </DiagramPanel>
        </PanelContainer>
        {selectedId === "trigger0" && (
          <ConfigFlowTriggerPanel
            triggerFieldSet={flow.fieldSet}
            triggerPermissions={flow.trigger.permission}
          />
        )}
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
