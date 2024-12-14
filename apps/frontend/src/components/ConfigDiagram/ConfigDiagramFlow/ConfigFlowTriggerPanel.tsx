import { Typography } from "@mui/material";

import {
  ConfigurationPanel,
  PanelAccordion,
  PanelContainer,
  PanelHeader,
} from "@/components/ConfigDiagram";
import { TriggerFieldSet } from "@/components/Field/TriggerFieldSet";
import { FieldSetFragment, PermissionFragment } from "@/graphql/generated/graphql";

import { Permissions } from "../../Permissions";

export const ConfigFlowTriggerPanel = ({
  triggerPermissions,
  triggerFieldSet,
}: {
  triggerPermissions: PermissionFragment;
  triggerFieldSet: FieldSetFragment;
}) => {
  return (
    <PanelContainer>
      <PanelHeader>
        <Typography color="primary" variant="label">
          Trigger configuration
        </Typography>{" "}
      </PanelHeader>
      <ConfigurationPanel>
        {triggerPermissions && (
          <PanelAccordion title="Trigger permission" hasError={false}>
            <Permissions permission={triggerPermissions} type="request" />
          </PanelAccordion>
        )}
        {triggerFieldSet.fields.length > 0 && (
          <PanelAccordion title="Trigger fields" hasError={false}>
            <Typography variant="description">
              The following fields must be answered to trigger the flow:
            </Typography>
            <TriggerFieldSet fieldSet={triggerFieldSet} />
          </PanelAccordion>
        )}
      </ConfigurationPanel>
    </PanelContainer>
  );
};
