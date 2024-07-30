import { Button } from "@mui/material";

import { statusProps } from "@/components/status/statusProps";
import { Status } from "@/graphql/generated/graphql";

export const WebhookTestButton = ({
  handleTestWebhook,
  testWebhookStatus,
}: {
  handleTestWebhook: (_event: React.MouseEvent<HTMLElement>) => void;
  testWebhookStatus: Status | null;
}) => {
  const WebhookStatusIcon = testWebhookStatus
    ? statusProps[testWebhookStatus].icon
    : statusProps.NotAttempted.icon;
  return (
    <Button
      variant="outlined"
      sx={{ width: "60px", marginTop: "8px" }}
      size={"small"}
      endIcon={
        <WebhookStatusIcon
          sx={{
            color: testWebhookStatus
              ? statusProps[testWebhookStatus].backgroundColor
              : statusProps.NotAttempted.backgroundColor,
          }}
        />
      }
      onClick={handleTestWebhook}
    >
      Test
    </Button>
  );
};
