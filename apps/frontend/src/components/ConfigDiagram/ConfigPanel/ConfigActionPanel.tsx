import {
  ConfigurationPanel,
  PanelAccordion,
  PanelContainer,
  PanelHeader,
} from "@/components/ConfigDiagram";
import { ActionFragment, FieldFragment } from "@/graphql/generated/graphql";
import { Typography } from "@mui/material";
import { Action } from "../Action";
import { ActionFilter } from "../ActionFilter";

export const ConfigActionPanel = ({
  action,
  prevStepResponseFields,
}: {
  action: ActionFragment;
  prevStepResponseFields?: FieldFragment[];
}) => {
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
          <Action action={action} />
        </PanelAccordion>
      </ConfigurationPanel>
    </PanelContainer>
  );
};
