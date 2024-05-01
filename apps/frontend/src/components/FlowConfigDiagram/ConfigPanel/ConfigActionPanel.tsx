import {
  ConfigurationPanel,
  PanelAccordion,
  PanelContainer,
  PanelHeader,
} from "@/components/FlowConfigDiagram";
import { Typography } from "@mui/material";

export const ConfigActionPanel = ({}: {}) => {
  return (
    <PanelContainer>
      <PanelHeader>
        <Typography color="primary" variant="label">
          Action configuration
        </Typography>{" "}
      </PanelHeader>
      <ConfigurationPanel>
        <PanelAccordion title="Permission" hasError={false}>
          hello
        </PanelAccordion>
        <PanelAccordion title="Request fields" hasError={false}>
          hello
        </PanelAccordion>
      </ConfigurationPanel>
    </PanelContainer>
  );
};
