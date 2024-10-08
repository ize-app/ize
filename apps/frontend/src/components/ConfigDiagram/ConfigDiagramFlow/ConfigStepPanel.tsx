import { Typography } from "@mui/material";

import {
  ConfigurationPanel,
  PanelAccordion,
  PanelContainer,
  PanelHeader,
} from "@/components/ConfigDiagram";
import { ActionFragment, StepFragment } from "@/graphql/generated/graphql";

import { ActionFilter } from "../../Action/ActionFilter";
import { ResultConfigs } from "../../result/ResultConfigs/ResultConfigs";
import { RespondPermissionPanel } from "../RespondPermissionPanel";

export const ConfigStepPanel = ({
  step,
  triggeringAction,
}: {
  step: StepFragment;
  triggeringAction: ActionFragment | null | undefined;
}) => {
  return (
    <PanelContainer>
      <PanelHeader>
        <Typography color="primary" variant="label">
          Step configuration
        </Typography>{" "}
      </PanelHeader>
      <ConfigurationPanel>
        {triggeringAction && triggeringAction.filterOption && (
          <PanelAccordion title="Filter" hasError={false}>
            <ActionFilter action={triggeringAction} />
          </PanelAccordion>
        )}
        <RespondPermissionPanel step={step} />
        <PanelAccordion title="Collaborations 👀" hasError={false}>
          <ResultConfigs resultConfigs={step.result} responseFields={step.response.fields} />
        </PanelAccordion>
      </ConfigurationPanel>
    </PanelContainer>
  );
};
