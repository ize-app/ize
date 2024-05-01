import {
  FlowConfigDiagramContainer,
  DiagramPanel,
  PanelContainer,
  StageContainer,
} from "@/components/FlowConfigDiagram";
import PlayCircleOutlineOutlined from "@mui/icons-material/PlayCircleOutlineOutlined";
import { Box } from "@mui/material";
import { useState } from "react";
import { StageConnectorButton } from "./DiagramPanel/StageConnectorButton";
import { FlowFragment } from "@/graphql/generated/graphql";
import Diversity3Outlined from "@mui/icons-material/Diversity3Outlined";
import { ConfigTriggerPanel } from "./ConfigPanel/ConfigTriggerPanel";
import { ConfigStepPanel } from "./ConfigPanel/ConfigStepPanel";
import { ConfigActionPanel } from "./ConfigPanel/ConfigActionPanel";

// Interactive diagram for understanding flow config
// does not allow  user to edit config
export const FlowConfigDiagramStatic = ({ flow }: { flow: FlowFragment }) => {
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
            <StageContainer
              label="Trigger"
              key="trigger0"
              id={"trigger0"}
              setSelectedId={setSelectedId}
              selectedId={selectedId}
              icon={<PlayCircleOutlineOutlined color="primary" />}
            />
            <StageConnectorButton />
            {flow.steps.map((step, index) => {
              return (
                <Box key={index}>
                  <StageContainer
                    icon={<Diversity3Outlined color="primary" />}
                    label={"Collaboration " + (index + 1).toString()}
                    key={"stage-" + step?.id}
                    hasError={false}
                    id={"step" + index.toString()}
                    setSelectedId={setSelectedId}
                    selectedId={selectedId}
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
                <StageContainer
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
        {selectedId === "trigger0" && <ConfigTriggerPanel step={flow.steps[0]} />}
        {flow.steps.map((step, index) => {
          return (
            selectedId === "step" + index.toString() && (
              <ConfigStepPanel key={"steppanel-" + step?.id} step={step} />
            )
          );
        })}
        {selectedId === "action" && <ConfigActionPanel />}
      </FlowConfigDiagramContainer>
    </Box>
  );
};
