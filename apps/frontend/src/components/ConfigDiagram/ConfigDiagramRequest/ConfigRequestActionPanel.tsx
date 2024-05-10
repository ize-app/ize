import {
  ConfigurationPanel,
  PanelAccordion,
  PanelContainer,
  PanelHeader,
} from "@/components/ConfigDiagram";
import { ActionFragment } from "@/graphql/generated/graphql";
import { Typography } from "@mui/material";
import { ActionConfig } from "../../Action/ActionConfig";
import { ActionFilter } from "../../Action/ActionFilter";

export const ConfigRequestActionPanel = ({ action }: { action: ActionFragment }) => {
  return (
    <PanelContainer>
      <PanelHeader>
        <Typography color="primary" variant="label">
          Action configuration
        </Typography>{" "}
      </PanelHeader>
      <ConfigurationPanel>
        {action.filterOption && (
          <PanelAccordion title="Filter" hasError={false}>
            <ActionFilter action={action} />
          </PanelAccordion>
        )}
        <PanelAccordion title="Action" hasError={false}>
          <ActionConfig action={action} />
        </PanelAccordion>
      </ConfigurationPanel>
    </PanelContainer>
  );
};
