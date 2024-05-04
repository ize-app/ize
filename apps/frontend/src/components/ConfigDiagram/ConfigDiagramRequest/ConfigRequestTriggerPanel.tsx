import {
  ConfigurationPanel,
  PanelAccordion,
  PanelContainer,
  PanelHeader,
} from "@/components/ConfigDiagram";
import { RequestStepFragment, StepFragment } from "@/graphql/generated/graphql";
import { Typography } from "@mui/material";
import { Fields } from "../ConfigDiagramFlow/Field/Fields";

export const ConfigRequestTriggerPanel = ({
  step,
  requestStep,
}: {
  step: StepFragment;
  requestStep: RequestStepFragment;
}) => {

  console.log("request step is ", requestStep);
  return (
    <PanelContainer>
      <PanelHeader>
        <Typography color="primary" variant="label">
          Trigger configuration
        </Typography>{" "}
      </PanelHeader>
      <ConfigurationPanel>
        <PanelAccordion title="Trigger permission" hasError={false}>
          {/* <Permissions permission={step.request.permission} type="request" /> */}
          TODO
        </PanelAccordion>
        {step.request.fields.length > 0 && (
          <PanelAccordion title="Request fields" hasError={false}>
            <Fields fields={step.request.fields} fieldAnswers={requestStep.requestFieldAnswers} />
          </PanelAccordion>
        )}
      </ConfigurationPanel>
    </PanelContainer>
  );
};
