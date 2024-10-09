import { Typography } from "@mui/material";

import { getActionLabel } from "@/components/Action/getActionLabel";
import {
  ConfigurationPanel,
  PanelAccordion,
  PanelContainer,
  PanelHeader,
} from "@/components/ConfigDiagram";
import { ActionFragment, ActionType, EntityFragment } from "@/graphql/generated/graphql";

import { ActionDescription } from "../../Action/ActionDescription";
import { ActionFilter } from "../../Action/ActionFilter";

export const ConfigFlowActionPanel = ({
  action,
  group,
}: {
  action: ActionFragment;
  group: EntityFragment | undefined | null;
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
          <ActionDescription
            action={action}
            actionType={action.__typename as ActionType}
            groupName={group?.name}
          />
        </PanelAccordion>
      </ConfigurationPanel>
    </PanelContainer>
  );
};
