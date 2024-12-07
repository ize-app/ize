import { useMutation } from "@apollo/client";
import { Box, Button, Icon, Paper, Typography, useTheme } from "@mui/material";
import { Link, generatePath } from "react-router-dom";

import eyeActiveUrl from "@/assets/ize-eye-active.svg";
import { WatchFilter, WatchGroupDocument } from "@/graphql/generated/graphql";
import useGroupsSearch from "@/hooks/useGroupsSearch";
import { Route } from "@/routers/routes";
import { colors } from "@/style/style";
import { fullUUIDToShort } from "@/utils/inputs";

export const GroupInvitations = () => {
  const { groups, refetch } = useGroupsSearch({
    queryResultLimit: 5,
    initialWatchFilter: WatchFilter.Watched,
    acknowledged: false,
  });
  const theme = useTheme()
  const [mutate] = useMutation(WatchGroupDocument,{
    onCompleted: () => {
      refetch()
    }
  });

  if (groups.length === 0) return null;
  return (
    <Paper
      elevation={2}
      sx={{
        // outline: "1px solid rgba(0, 0, 0, 0.23)",
        padding: "12px",
        width: "100%",
        maxWidth: "400px",
        display: "flex",
        flexDirection: "column",
        marginBottom: "34px",

        borderRadius: "2px",
      }}
    >
      <Typography variant="label">Group invitations</Typography>
      <Box sx={{ display: "flex", flexDirection: "column", width: "100%", marginTop: "12px" }}>
        {groups.map((group) => {
          return (
            <Box
              key={group.groupId}
              sx={{
                display: "flex",
                gap: "6px",
                width: "100%",
                justifyContent: "space-between",
                flexWrap: "wrap",
                backgroundColor: "white",
                borderRadius: "4px",
                padding: "8px",
                // outline: "1px solid rgba(0, 0, 0, 0.23)",
                outline: `1px solid ${colors.primaryContainer}`,
              }}
            >
              {" "}
              <Typography sx={{ textDecoration: "none" }}>
                <Link
                  key={""}
                  to={generatePath(Route.Group, {
                    groupId: fullUUIDToShort(group.groupId),
                  })}
                  style={{ textDecoration: "none", color: theme.palette.primary.main }}
                >
                  {group.group.name}
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
    </Paper>
  );
};
