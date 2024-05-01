import {
  ConfigurationPanel,
  PanelAccordion,
  PanelContainer,
  PanelHeader,
} from "@/components/FlowConfigDiagram";
import { StepFragment } from "@/graphql/generated/graphql";
import { Typography } from "@mui/material";
import { Permissions } from "../Permissions";
import { Fields } from "../Fields";

export const ConfigTriggerPanel = ({ step }: { step: StepFragment }) => {
  return (
    <PanelContainer>
      <PanelHeader>
        <Typography color="primary" variant="label">
          Trigger configuration
        </Typography>{" "}
      </PanelHeader>
      <ConfigurationPanel>
        <PanelAccordion title="Trigger permission" hasError={false}>
          <Permissions permission={step.request.permission} type="request" />
        </PanelAccordion>
        <PanelAccordion title="Request fields" hasError={false}>
          <Fields fields={step.request.fields} />
        </PanelAccordion>
      </ConfigurationPanel>
    </PanelContainer>
  );
};
