import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { InfoBannerContainer } from "@/components/InfoBanner/InfoBannerContainer";
import { CurrentUserContext } from "@/hooks/contexts/current_user_context";
import { NewFlowRoute, Route, newFlowRoute } from "@/routers/routes";
import { colors } from "@/style/style";

const TodoItem = ({
  complete,
  title,
  subtitle,
  route,
}: {
  complete: boolean;
  title: string;
  subtitle: string;
  route: string;
}) => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        backgroundColor: "white",
        width: "100%",
        padding: "8px",
        outline: `1px solid ${colors.primaryContainer}`,
      }}
      onClick={() => {
        navigate(route);
      }}
    >
      {complete ? (
        <CheckCircleOutlineIcon color="primary" fontSize="small" />
      ) : (
        <RadioButtonUncheckedIcon color="primary" fontSize="small" />
      )}
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Typography color="primary">{title}</Typography>
        <Typography variant="description">{subtitle}</Typography>
      </Box>
    </Box>
  );
};

export const NewUserTodoList = () => {
  const { me } = useContext(CurrentUserContext);

  if (me?.hasCreatedFlow && me?.hasWatchedGroup) return null;
  return (
    <InfoBannerContainer
      title="Welcome to Ize! It's quick to get started. Here's how:"
      showInfoIcon={true}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "12px",
          padding: "0px 4px",
        }}
      >
        <TodoItem
          complete={me?.hasCreatedFlow ?? false}
          title="Create a flow"
          subtitle={"Flows are reusable processes that span teams and tools"}
          route={newFlowRoute(NewFlowRoute.InitialSetup)}
        />
        <TodoItem
          complete={me?.hasWatchedGroup ?? false}
          title="Join or create a group"
          subtitle={"Groups are collaboratively managed teams that can integrate with Telegram"}
          route={Route.Groups}
        />
      </Box>
    </InfoBannerContainer>
  );
};
