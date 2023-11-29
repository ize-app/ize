import Typography from "@mui/material/Typography";

import { defaultWebhookTriggerOption } from "@/components/shared/Form/ProcessForm/types";

const SummarizeAction = ({
  uri,
  optionTrigger,
  fontSize = "body1",
}: {
  uri: string;
  optionTrigger: string | undefined;
  fontSize?: "body1" | "body2";
}) => {
  return !optionTrigger ||
    optionTrigger === defaultWebhookTriggerOption.value ? (
    <Typography variant={fontSize}>
      After all decisions, a custom integration is triggered via {uri}
    </Typography>
  ) : (
    <Typography variant={fontSize}>
      If decision is <span style={{ fontWeight: 900 }}>{optionTrigger}</span>, a
      custom integration is triggered via {uri}
    </Typography>
  );
};

export default SummarizeAction;
