import Typography from "@mui/material/Typography";

import { defaultWebhookTriggerOption } from "../../NewProcess/newProcessWizard";

const SummarizeAction = ({
  uri,
  optionTrigger,
}: {
  uri: string;
  optionTrigger: string | undefined;
}) => {
  console.log("option trigger is ", optionTrigger);
  return !optionTrigger ||
    optionTrigger === defaultWebhookTriggerOption.value ? (
    <Typography>
      After all decisions, a custom integration is triggered via {uri}
    </Typography>
  ) : (
    <Typography>
      When the final decision is{" "}
      <span style={{ fontWeight: 900 }}>{optionTrigger}</span>, a custom
      integration is triggered via {uri}
    </Typography>
  );
};

export default SummarizeAction;
