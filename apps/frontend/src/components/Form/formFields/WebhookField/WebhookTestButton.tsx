import { Button, SvgIcon } from "@mui/material";

import { genericStatusProps } from "@/components/status/statusProps";
import { Status } from "@/graphql/generated/graphql";

export const WebhookTestButton = ({
  handleTestWebhook,
  testWebhookStatus,
}: {
  handleTestWebhook: (_event: React.MouseEvent<HTMLElement>) => void;
  testWebhookStatus: Status | null;
}) => {
  const statusProps = genericStatusProps[testWebhookStatus ?? Status.NotAttempted];

  return (
    <Button
      variant="outlined"
      sx={{ width: "60px", marginTop: "8px" }}
      size={"small"}
      endIcon={
        statusProps.icon ? (
          <SvgIcon component={statusProps.icon} sx={{ color: statusProps.color }} />
        ) : null
      }
      onClick={handleTestWebhook}
    >
      Test
    </Button>
  );
};
