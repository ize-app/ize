import {
  ConfigurationPanel,
  PanelAccordion,
  PanelContainer,
  PanelHeader,
} from "@/components/ConfigDiagram";
import { ActionFragment, StepFragment } from "@/graphql/generated/graphql";
import { Typography } from "@mui/material";
import { Permissions } from "./Permissions";
import { ResultConfigs } from "../../result/ResultConfigs/ResultConfigs";
import { ActionFilter } from "./Action/ActionFilter";
import { intervalToIntuitiveTimeString } from "@/utils/inputs";

export const ConfigStepPanel = ({
  step,
  triggeringAction,
}: {
  step: StepFragment;
  triggeringAction: ActionFragment | null | undefined;
}) => {
  return (
    <PanelContainer>
      <PanelHeader>
        <Typography color="primary" variant="label">
          Step configuration
        </Typography>{" "}
      </PanelHeader>
      <ConfigurationPanel>
        {triggeringAction && triggeringAction.filterOption && (
          <PanelAccordion title="Filter" hasError={false}>
            <ActionFilter action={triggeringAction} />
          </PanelAccordion>
        )}
        <PanelAccordion title="Respond permission" hasError={false}>
          <Permissions permission={step.response.permission} type="response" />
          {step.expirationSeconds &&
            `Respondants have ${intervalToIntuitiveTimeString(
              step.expirationSeconds,
            )} to respond and can respond ${
              step.allowMultipleResponses ? "multiple times" : "only once"
            }`}
        </PanelAccordion>
        <PanelAccordion title="Collaborations 👀" hasError={false}>
          <ResultConfigs resultConfigs={step.result} responseFields={step.response.fields} />
        </PanelAccordion>
      </ConfigurationPanel>
    </PanelContainer>
  );
};
