import { Box, Button } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

import { GroupInvitations } from "@/components/GroupInvitations/GroupInivitations";
import { InfoBannerContainer } from "@/components/InfoBanner/InfoBannerContainer";
import Head from "@/layout/Head";
import PageContainer from "@/layout/PageContainer";
import { NewCustomGroupRoute, newCustomGroupRoute } from "@/routers/routes";

import { GroupsSearch } from "./GroupsSearch";

export const Groups = () => {
  const navigate = useNavigate();
  return (
    <PageContainer>
      <Head title={"Groups"} description={"Your watched groups"} />
      <Typography variant="h1">Groups</Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "30px" }}>
        <InfoBannerContainer
          title="Groups are collaboratively managed organisms. Integrate your Telegram account into a
            group to participate in and initate Ize flows within the chat."
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
                navigate(newCustomGroupRoute(NewCustomGroupRoute.Setup));
              }}
              sx={{ alignSelf: "flexStart", width: "160px" }}
            >
              Create a group
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                navigate(newCustomGroupRoute(NewCustomGroupRoute.Setup));
              }}
              sx={{
                width: "160px",
              }}
            >
              Integrate Telegram
            </Button>
          </Box>
        </InfoBannerContainer>
        <GroupInvitations />
        <GroupsSearch />
      </Box>
    </PageContainer>
  );
};
