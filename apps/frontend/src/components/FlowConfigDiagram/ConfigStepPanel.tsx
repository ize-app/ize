import {
  ConfigurationPanel,
  PanelAccordion,
  PanelContainer,
  PanelHeader,
} from "@/components/FlowConfigDiagram";
import { StepFragment } from "@/graphql/generated/graphql";
import { Typography } from "@mui/material";
import { Permissions } from "./Permissions";

export const ConfigStepPanel = ({ step }: { step: StepFragment }) => {
  console.log("rendering step", step);
  return (
    <PanelContainer>
      <PanelHeader>
        <Typography color="primary" variant="label">
          Step configuration
        </Typography>{" "}
      </PanelHeader>
      <ConfigurationPanel>
        <PanelAccordion title="Respond permission" hasError={false}>
          <Permissions permission={step.response.permission} type="response" />
        </PanelAccordion>
        <PanelAccordion title="Request fields" hasError={false}>
          hello
        </PanelAccordion>
      </ConfigurationPanel>
    </PanelContainer>
  );
};
