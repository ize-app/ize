import { ActionExecution } from "@/components/Action/ActionExecution";
import { actionProperties } from "@/components/Action/actionProperties";
import { ConfigurationPanel, PanelAccordion, PanelContainer } from "@/components/ConfigDiagram";
import { ActionExecutionFragment, ActionFragment } from "@/graphql/generated/graphql";

import { ActionFilter } from "../../Action/ActionFilter";

export const ConfigRequestActionPanel = ({
  action,
  actionExecution,
}: {
  action: ActionFragment;
  actionExecution: ActionExecutionFragment | null;
}) => {
  return (
    <PanelContainer>
      {/* <PanelHeader>
        <Typography color="primary" variant="label">
          {actionProperties[action.__typename].label + " configuration"}
        </Typography>
      </PanelHeader> */}
      <ConfigurationPanel>
        {action.filterOption && (
          <PanelAccordion title="Filter" hasError={false}>
            <ActionFilter action={action} />
          </PanelAccordion>
        )}
        <PanelAccordion title={actionProperties[action.__typename].label} hasError={false}>
          <ActionExecution action={action} actionExecution={actionExecution} />
        </PanelAccordion>
      </ConfigurationPanel>
    </PanelContainer>
  );
};
