import { Typography } from "@mui/material";

import { PermissionFragment } from "@/graphql/generated/graphql";

import { EntityList } from "./EntityList";

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

      {permission.entities.length > 0 && <EntityList entities={permission.entities} />}
    </>
  );
};
