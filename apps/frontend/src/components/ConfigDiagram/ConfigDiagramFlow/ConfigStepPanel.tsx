import { Typography } from "@mui/material";

import {
  ConfigurationPanel,
  PanelAccordion,
  PanelContainer,
  PanelHeader,
} from "@/components/ConfigDiagram";
import { StepFragment } from "@/graphql/generated/graphql";

import { ResultConfigs } from "../../result/ResultConfigs/ResultConfigs";
import { RespondPermissionPanel } from "../RespondPermissionPanel";

export const ConfigStepPanel = ({ step }: { step: StepFragment }) => {
  return (
    <PanelContainer>
      <PanelHeader>
        <Typography color="primary" variant="label">
          Step configuration
        </Typography>{" "}
      </PanelHeader>
      <ConfigurationPanel>
        <RespondPermissionPanel step={step} />
        <PanelAccordion title="Collaborations 👀" hasError={false}>
          <ResultConfigs resultConfigs={step.result} />
        </PanelAccordion>
      </ConfigurationPanel>
    </PanelContainer>
  );
};
