import { Typography } from "@mui/material";

import {
  ConfigurationPanel,
  PanelAccordion,
  PanelContainer,
  PanelHeader,
} from "@/components/ConfigDiagram";
import { ActionFragment, ActionType, EntityFragment } from "@/graphql/generated/graphql";

import { ActionDescription } from "../../Action/ActionDescription";

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
          {action.name + " configuration"}
        </Typography>{" "}
      </PanelHeader>
      <ConfigurationPanel>
        <PanelAccordion title={action.name} hasError={false}>
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
