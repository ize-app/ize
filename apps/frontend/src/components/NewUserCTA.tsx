import { Box, Button, Typography } from "@mui/material";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import izeLogoUrl from "@/assets/ize-logo-circle.svg";
import telegramLogoUrl from "@/assets/telegram-logo.svg";
import { CurrentUserContext } from "@/hooks/contexts/current_user_context";
import {
  NewCustomGroupRoute,
  NewFlowRoute,
  newCustomGroupRoute,
  newFlowRoute,
} from "@/routers/routes";

import { InfoBannerContainer } from "./InfoBanner/InfoBannerContainer";

const CTAButton = ({
  title,
  description,
  imgSrc,
  route,
}: {
  title: string;
  description: string;
  imgSrc: string;
  route: string;
}) => {
  const navigate = useNavigate();
  return (
    <Button
      color="primary"
      onClick={() => {
        navigate(route);
      }}
      sx={{
        display: "flex",
        maxWidth: "400px",
        border: "1px solid",
        borderRadius: "6px",
        gap: "12px",
        width: "320px",
        justifyContent: "flex-start",
      }}
    >
      <Box component="img" src={imgSrc} sx={{ width: "40px" }} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
        }}
      >
        <Typography variant="label" textAlign="left">
          {title}
        </Typography>
        <Typography variant="description" textAlign="left">
          {description}
        </Typography>
      </Box>
    </Button>
  );
};

export const NewUserCTA = () => {
  const { me } = useContext(CurrentUserContext);

  // only display if user was created in last 1 days
  if (me && new Date(me.user.createdAt) < new Date(Date.now() - 1000 * 60 * 60 * 24 * 3))
    return null;

  return (
    <InfoBannerContainer title="Welcome! Here's a couple ways to get started">
      <Box
        sx={(theme) => ({
          [theme.breakpoints.down("md")]: {
            flexDirection: "column",
            // gap: "0px",
          },
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
        })}
      >
        <CTAButton
          title="Create a flow"
          description="Create process that spans the boundaries of tools, teams, and time"
          imgSrc={izeLogoUrl}
          route={newFlowRoute(NewFlowRoute.InitialSetup)}
        />
        <CTAButton
          title="Link your Telegram group"
          description="Participate in Ize flows directly from your Telegram channel"
          imgSrc={telegramLogoUrl}
          route={newCustomGroupRoute(NewCustomGroupRoute.Setup)}
        />
      </Box>
    </InfoBannerContainer>
  );
};
