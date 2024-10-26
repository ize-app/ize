import { ActionExecution } from "@/components/Action/ActionExecution";
import { ConfigurationPanel, PanelAccordion, PanelContainer } from "@/components/ConfigDiagram";
import {
  ActionExecutionFragment,
  ActionFragment,
  GroupSummaryPartsFragment,
} from "@/graphql/generated/graphql";

import { ActionFilter } from "../../Action/ActionFilter";

export const ConfigRequestActionPanel = ({
  action,
  actionExecution,
}: {
  action: ActionFragment;
  actionExecution: ActionExecutionFragment | null;
  group: GroupSummaryPartsFragment | undefined | null;
}) => {
  return (
    <PanelContainer>
      <ConfigurationPanel>
        {action.filterOption && (
          <PanelAccordion title="Filter" hasError={false}>
            <ActionFilter action={action} />
          </PanelAccordion>
        )}
        <PanelAccordion title={action.name} hasError={false}>
          <ActionExecution action={action} actionExecution={actionExecution} />
        </PanelAccordion>
      </ConfigurationPanel>
    </PanelContainer>
  );
};
