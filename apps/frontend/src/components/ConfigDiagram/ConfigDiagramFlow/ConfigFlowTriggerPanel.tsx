import { Typography } from "@mui/material";

import {
  ConfigurationPanel,
  PanelAccordion,
  PanelContainer,
  PanelHeader,
} from "@/components/ConfigDiagram";
import { Fields } from "@/components/Field/Fields";
import { StepFragment } from "@/graphql/generated/graphql";

import { Permissions } from "../../Permissions";

export const ConfigFlowTriggerPanel = ({ step }: { step: StepFragment }) => {
  return (
    <PanelContainer>
      <PanelHeader>
        <Typography color="primary" variant="label">
          Trigger configuration
        </Typography>{" "}
      </PanelHeader>
      <ConfigurationPanel>
        {step.request.permission && (
          <PanelAccordion title="Trigger permission" hasError={false}>
            <Permissions permission={step.request.permission} type="request" />
          </PanelAccordion>
        )}
        {step.request.fields.length > 0 && (
          <PanelAccordion title="Request fields" hasError={false}>
            <Typography variant="description">
              The following fields must be answered to trigger the flow:
            </Typography>
            <Fields fields={step.request.fields} />
          </PanelAccordion>
        )}
      </ConfigurationPanel>
    </PanelContainer>
  );
};
