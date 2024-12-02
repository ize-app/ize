import Box from "@mui/material/Box";

import { EntityFragment } from "@/graphql/generated/graphql";

import { AvatarWithName } from "../Avatar/AvatarWithName";

export const EntityList = ({ entities }: { entities: EntityFragment[] }) => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
    {entities.map((entity) => {
      return <AvatarWithName avatar={entity} key={entity.id} />;
    })}
  </Box>
);
