import { Box } from "@mui/material";
import { useState } from "react";

import {
  DiagramPanel,
  FlowConfigDiagramContainer,
  FlowStage,
  PanelContainer,
} from "@/components/ConfigDiagram";
import { FlowFragment } from "@/graphql/generated/graphql";

import { ConfigFlowActionFilterPanel } from "./ConfigFlowActionFilterPanel";
import { ConfigFlowActionPanel } from "./ConfigFlowActionPanel";
import { ConfigFlowTriggerPanel } from "./ConfigFlowTriggerPanel";
import { ConfigStepPanel } from "./ConfigStepPanel";
import { StageConnectorButton } from "../Stage/StageConnectorButton";
import { StageType } from "../Stage/StageType";

// Interactive diagram for understanding flow config
// does not allow  user to edit config
export const ConfigDiagramFlow = ({ flow }: { flow: FlowFragment }) => {
  const [selectedId, setSelectedId] = useState<string | false>("trigger0"); // change to step1

  const finalStepIndex = flow.steps.length - 1;
  const finalAction = flow.steps[finalStepIndex]?.action ?? null;
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <FlowConfigDiagramContainer>
        <PanelContainer>
          <DiagramPanel>
            <FlowStage
              type={StageType.Trigger}
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
                    type={StageType.Step}
                    step={step}
                    key={"step-" + step?.id}
                    id={"step" + index.toString()}
                    setSelectedId={setSelectedId}
                    selectedId={selectedId}
                  />
                  <FlowStage
                    type={StageType.ActionFilter}
                    action={step.action}
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
                <FlowStage
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
        {selectedId === "trigger0" && (
          <ConfigFlowTriggerPanel
            triggerFieldSet={flow.fieldSet}
            triggerPermissions={flow.trigger.permission}
          />
        )}
        {flow.steps.map((step, index) => {
          return (
            selectedId === "step" + index.toString() && (
              <ConfigStepPanel key={"steppanel-" + step?.id} step={step} />
            )
          );
        })}
        {flow.steps.map((step, index) => {
          return (
            selectedId === "actionFilter" + index.toString() && (
              <ConfigFlowActionFilterPanel
                key={"actionFilterpanel-" + step?.id}
                action={step.action}
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
