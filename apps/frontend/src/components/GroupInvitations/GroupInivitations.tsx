import { useMutation } from "@apollo/client";
import { Box, Button, Icon, Typography, useTheme } from "@mui/material";
import { Link, generatePath } from "react-router-dom";

import eyeActiveUrl from "@/assets/ize-eye-active.svg";
import { GroupWatchFilter, WatchGroupDocument } from "@/graphql/generated/graphql";
import useGroupsSearch from "@/hooks/useGroupsSearch";
import { Route } from "@/routers/routes";
import { colors } from "@/style/style";
import { fullUUIDToShort } from "@/utils/inputs";

import { InfoBannerContainer } from "../InfoBanner/InfoBannerContainer";

export const GroupInvitations = () => {
  const { groups, refetch } = useGroupsSearch({
    queryResultLimit: 5,
    initialWatchFilter: GroupWatchFilter.NotAcknowledged,
    initialIsMember: true,
  });
  const theme = useTheme();
  const [mutate] = useMutation(WatchGroupDocument, {
    onCompleted: () => {
      refetch();
    },
  });

  if (groups.length === 0) return null;
  return (
    <InfoBannerContainer title="Group Invitations">
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          gap: "12px",
          maxWidth: "100%",
          flexWrap: "wrap",
        }}
      >
        {groups.map((group) => {
          return (
            <Box
              key={group.groupId}
              sx={{
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
                backgroundColor: "white",
                borderRadius: "4px",
                padding: "8px",
                maxWidth: "400px",
                // outline: "1px solid rgba(0, 0, 0, 0.23)",
                outline: `1px solid ${colors.primaryContainer}`,
              }}
            >
              {" "}
              <Typography
                sx={{
                  textDecoration: "none",
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: "1",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                <Link
                  key={""}
                  to={generatePath(Route.Group, {
                    groupId: fullUUIDToShort(group.groupId),
                  })}
                  style={{ textDecoration: "none", color: theme.palette.primary.main }}
                >
                  {group.group.name} asdfasdfalksdjfasl;dkfjasdfasdfasdfasdf
                </Link>
              </Typography>
              <Box sx={{ display: "flex", gap: "8px" }}>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  sx={{ height: "24px" }}
                  onClick={async () => {
                    await mutate({
                      variables: { groupId: group.groupId, watch: true },
                    });
                    // a bit clunky. in the future, i want to trigger update on groups search table here istead
                    window.location.reload();
                  }}
                  endIcon={
                    <Icon>
                      <img src={eyeActiveUrl} />
                    </Icon>
                  }
                >
                  Watch
                </Button>
                <Button
                  size="small"
                  color="secondary"
                  variant="outlined"
                  sx={{ height: "24px" }}
                  onClick={async () => {
                    await mutate({
                      variables: { groupId: group.groupId, watch: false },
                    });
                  }}
                >
                  Ignore
                </Button>
              </Box>
            </Box>
          );
        })}
      </Box>
    </InfoBannerContainer>
  );
};
