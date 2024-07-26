import { Typography } from "@mui/material";

import { getActionLabel } from "@/components/Action/getActionLabel";
import {
  ConfigurationPanel,
  PanelAccordion,
  PanelContainer,
  PanelHeader,
} from "@/components/ConfigDiagram";
import { ActionFragment, EntitySummaryPartsFragment } from "@/graphql/generated/graphql";

import { ActionConfig } from "../../Action/ActionConfig";
import { ActionFilter } from "../../Action/ActionFilter";

export const ConfigFlowActionPanel = ({
  action,
  group,
}: {
  action: ActionFragment;
  group: EntitySummaryPartsFragment | undefined | null;
}) => {
  return (
    <PanelContainer>
      <PanelHeader>
        <Typography color="primary" variant="label">
          {getActionLabel(action, group) + " configuration"}
        </Typography>{" "}
      </PanelHeader>
      <ConfigurationPanel>
        {action.filterOption && (
          <PanelAccordion title="Filter" hasError={false}>
            <ActionFilter action={action} />
          </PanelAccordion>
        )}
        <PanelAccordion title={getActionLabel(action, group)} hasError={false}>
          <ActionConfig action={action} group={group} />
        </PanelAccordion>
      </ConfigurationPanel>
    </PanelContainer>
  );
};
