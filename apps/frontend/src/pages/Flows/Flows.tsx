import { Box, Button } from "@mui/material";
import Typography from "@mui/material/Typography";
import { generatePath, useNavigate } from "react-router-dom";

import { InfoBannerContainer } from "@/components/InfoBanner/InfoBannerContainer.tsx";
import Head from "@/layout/Head.tsx";
import PageContainer from "@/layout/PageContainer";
import { NewFlowRoute, Route, newFlowRoute } from "@/routers/routes.ts";
import { fullUUIDToShort } from "@/utils/inputs.ts";

import { FlowsSearch } from "./FlowsSearch.tsx";

export const Flows = () => {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <Head title={"Flows"} description={"View and trigger your collaborative flows."} />
      <Typography variant="h1">Flows</Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "30px" }}>
        <InfoBannerContainer
          title="Flows are reusable processes that connect teams and tools. Build flows to make decisions, come to a shared understanding, and trigger other tools."
          showInfoIcon={false}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "12px",
              justifyContent: "flex-start",
            }}
          >
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                navigate(newFlowRoute(NewFlowRoute.InitialSetup));
              }}
              sx={{
                width: "160px",
              }}
            >
              Create a flow
            </Button>
          </Box>
        </InfoBannerContainer>
        <FlowsSearch
          onClickRow={(flow) => {
            navigate(
              generatePath(Route.Flow, {
                flowId: fullUUIDToShort(flow.flowId),
                flowVersionId: null,
              }),
            );
          }}
        />
      </Box>
    </PageContainer>
  );
};
