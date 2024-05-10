import {
  ConfigurationPanel,
  PanelAccordion,
  PanelContainer,
  PanelHeader,
} from "@/components/ConfigDiagram";
import { ActionFragment } from "@/graphql/generated/graphql";
import { Typography } from "@mui/material";
import { ActionFilter } from "../../Action/ActionFilter";
import { actionProperties } from "@/components/Action/actionProperties";
import { ActionExecution } from "@/components/Action/ActionExecution";

export const ConfigRequestActionPanel = ({ action }: { action: ActionFragment }) => {
  return (
    <PanelContainer>
      <PanelHeader>
        <Typography color="primary" variant="label">
          {actionProperties[action.__typename].label + " configuration"}
        </Typography>{" "}
      </PanelHeader>
      <ConfigurationPanel>
        {action.filterOption && (
          <PanelAccordion title="Filter" hasError={false}>
            <ActionFilter action={action} />
          </PanelAccordion>
        )}
        <PanelAccordion title={actionProperties[action.__typename].label} hasError={false}>
          <ActionExecution action={action} />
        </PanelAccordion>
      </ConfigurationPanel>
    </PanelContainer>
  );
};
