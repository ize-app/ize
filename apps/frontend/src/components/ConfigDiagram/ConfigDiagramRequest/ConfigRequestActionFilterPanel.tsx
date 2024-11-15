import { Typography } from "@mui/material";

import {
  ConfigurationPanel,
  PanelAccordion,
  PanelContainer,
  PanelHeader,
} from "@/components/ConfigDiagram";
import { ActionFragment } from "@/graphql/generated/graphql";

import { ActionFilter } from "../../Action/ActionFilter";
export const ConfigRequestActionFilterPanel = ({
  action,
}: {
  action: ActionFragment | null | undefined;
}) => {
  if (!action || !action.filterOption) return null;
  return (
    <PanelContainer>
      <PanelHeader>
        <Typography color="primary" variant="label">
          Action filter configuration
        </Typography>{" "}
      </PanelHeader>
      <ConfigurationPanel>
        <PanelAccordion title="Filter" hasError={false}>
          <ActionFilter action={action} />
        </PanelAccordion>
      </ConfigurationPanel>
    </PanelContainer>
  );
};
