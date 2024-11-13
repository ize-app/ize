import Diversity3Outlined from "@mui/icons-material/Diversity3Outlined";
import PlayCircleOutlineOutlined from "@mui/icons-material/PlayCircleOutlineOutlined";
import { Box } from "@mui/material";
import { useState } from "react";

import { actionProperties } from "@/components/Action/actionProperties";
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
              label="Trigger"
              key="trigger0"
              id={"trigger0"}
              setSelectedId={setSelectedId}
              selectedId={selectedId}
              icon={PlayCircleOutlineOutlined}
              entities={flow.trigger.permission?.entities}
            />
            {flow.steps.map((step, index) => {
              if (step.fieldSet.fields.length === 0) return null;
              return (
                <Box key={index}>
                  <StageConnectorButton key={"connector-" + index.toString()} />
                  <FlowStage
                    icon={Diversity3Outlined}
                    label={step.result[0]?.name}
                    subtitle={flow.steps[index].fieldSet.fields[0]?.name}
                    key={"stage-" + step?.id}
                    hasError={false}
                    id={"step" + index.toString()}
                    setSelectedId={setSelectedId}
                    selectedId={selectedId}
                    entities={flow.steps[index].response?.permission.entities}
                  />
                </Box>
              );
            })}
            {finalAction && (
              <>
                <StageConnectorButton key={"connector-final"} />
                <FlowStage
                  hasError={false}
                  label={finalAction.name}
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
