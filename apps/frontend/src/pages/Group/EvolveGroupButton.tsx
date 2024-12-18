import EditIcon from "@mui/icons-material/Edit";
import { Button } from "@mui/material";
import { generatePath, useNavigate } from "react-router-dom";

import { NewRequestRoute, newRequestRoute } from "@/routers/routes";
import { fullUUIDToShort } from "@/utils/inputs";

export const EvolveGroupButton = ({
  evolveGroupFlowId,
}: {
  evolveGroupFlowId: string | null | undefined;
}) => {
  const navigate = useNavigate();
  return (
    evolveGroupFlowId && (
      <Button
        variant={"outlined"}
        color={"primary"}
        sx={{ width: "140px", borderRadius: "6px" }}
        endIcon={<EditIcon />}
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          navigate(
            generatePath(newRequestRoute(NewRequestRoute.CreateRequest), {
              flowId: fullUUIDToShort(evolveGroupFlowId),
            }),
          );
        }}
      >
        Evolve group
      </Button>
    )
  );
};
