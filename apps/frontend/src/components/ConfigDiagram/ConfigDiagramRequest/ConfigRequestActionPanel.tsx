import { ActionExecution } from "@/components/Action/ActionExecution";
import { getActionLabel } from "@/components/Action/getActionLabel";
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
  group,
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
        <PanelAccordion title={getActionLabel(action, group)} hasError={false}>
          <ActionExecution action={action} actionExecution={actionExecution} />
        </PanelAccordion>
      </ConfigurationPanel>
    </PanelContainer>
  );
};
