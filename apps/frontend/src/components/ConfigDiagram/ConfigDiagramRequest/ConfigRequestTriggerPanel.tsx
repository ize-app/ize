import { Box, Typography } from "@mui/material";

import { AvatarWithName } from "@/components/Avatar";
import { ConfigurationPanel, PanelAccordion, PanelContainer } from "@/components/ConfigDiagram";
import { TriggerFieldSet } from "@/components/Field/TriggerFieldSet";
import { RequestFragment } from "@/graphql/generated/graphql";

export const ConfigRequestTriggerPanel = ({ request }: { request: RequestFragment }) => {
  return (
    <PanelContainer>
      <ConfigurationPanel>
        <PanelAccordion title="Trigger permission" hasError={false}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography>Created by: </Typography>
            <AvatarWithName avatar={request.creator} />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography>Created at: </Typography>
            <Typography>{new Date(request.createdAt).toLocaleString()}</Typography>
          </Box>
        </PanelAccordion>
        {request.flow.fieldSet.fields.length > 0 && (
          <PanelAccordion title="Trigger fields" hasError={false}>
            <TriggerFieldSet
              fieldSet={request.flow.fieldSet}
              fieldAnswers={request.triggerFieldAnswers}
            />
          </PanelAccordion>
        )}
      </ConfigurationPanel>
    </PanelContainer>
  );
};
