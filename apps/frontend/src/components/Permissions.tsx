import { Typography } from "@mui/material";
import Box from "@mui/material/Box";

import { PermissionFragment } from "@/graphql/generated/graphql";

import { AvatarWithName } from "./Avatar/AvatarWithName";

export const Permissions = ({
  permission,
  type,
}: {
  permission: PermissionFragment;
  type: "request" | "response";
}) => {
  return (
    <>
      {permission.anyone && (
        <Typography>
          {type === "request" ? "Anyone can trigger this flow" : "Anyone can respond"}
        </Typography>
      )}
      {permission.entities.length > 0 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {permission.entities.map((entity) => {
            return <AvatarWithName avatar={entity} key={entity.id} />;
          })}
        </Box>
      )}
    </>
  );
};
