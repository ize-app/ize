import { Box, Typography } from "@mui/material";

import {
  ConfigurationPanel,
  PanelAccordion,
  PanelContainer,
  PanelHeader,
} from "@/components/ConfigDiagram";
import { actionStatusProps } from "@/components/status/actionStatusProps";
import { StatusTag } from "@/components/status/StatusTag";
import { DataTable } from "@/components/Tables/DataTable/DataTable";
import { ActionExecutionFragment, ActionFragment, ActionStatus } from "@/graphql/generated/graphql";

import { ActionFilter } from "../../Action/ActionFilter";

const refineActionFilterStatus = (status: ActionStatus | null | undefined) => {
  if (!status) return ActionStatus.NotStarted;
  if ([ActionStatus.Attempting, ActionStatus.Error, ActionStatus.Complete].includes(status))
    return ActionStatus.Complete;
  else return status;
};

export const ConfigRequestActionFilterPanel = ({
  action,
  actionExecution,
}: {
  action: ActionFragment | null | undefined;
  actionExecution: ActionExecutionFragment | null | undefined;
}) => {
  if (!action || !action.filterOption) return null;

  const data = [
    {
      label: "Status",
      value: (
        <StatusTag
          statusProps={actionStatusProps[refineActionFilterStatus(actionExecution?.status)]}
        />
      ),
    },
  ];
  return (
    <PanelContainer>
      <PanelHeader>
        <Typography color="primary" variant="label">
          Action filter configuration
        </Typography>{" "}
      </PanelHeader>
      <ConfigurationPanel>
        <PanelAccordion title="Filter" hasError={false}>
          <Box>
            <DataTable data={data} ariaLabel="Action status table" />
          </Box>
          <ActionFilter action={action} />
        </PanelAccordion>
      </ConfigurationPanel>
    </PanelContainer>
  );
};
