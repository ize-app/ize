import { Box, Button, Fade, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";

import izeLogoUrl from "@/assets/ize-logo-circle.svg";
import { LoginButton } from "@/components/Auth/LoginButton";
import { IzeLogoBackground } from "@/layout/IzeLogoBackground";

import { ContactSection } from "./ContactSection";
import { InfoBoxesSection } from "./InfoBoxesSection";
import { UseCasesSection } from "./UseCasesSection";

const UnauthenticatedHome: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isSmallScreenSize = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Box sx={{ backgroundColor: "#fff" }}>
      <Box
        sx={(theme) => ({
          height: "25vh",
          display: "flex",
          [theme.breakpoints.down("sm")]: {
            height: "80vh",
          },
          padding: "64px 0px",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff",
          textAlign: "center",
          px: 2,
        })}
      >
        {isSmallScreenSize && (
          <Box component="img" src={izeLogoUrl} alt="Ize Logo" sx={{ width: 300, mb: 4 }} />
        )}
        <Fade in={true} timeout={500}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Typography
              variant="h1"
              fontSize={isSmallScreenSize ? "2.25rem" : "3rem"}
              sx={{
                fontFamily: "Sora",
                mt: 2,
                mb: 2,
              }}
            >
              The collective process platform
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontFamily: "Sora",
                fontWeight: 400,
                mb: 4,
              }}
              color={"secondary"}
            >
              How distributed teams scale, share power, and harness collective intelligence
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  navigate("/about");
                }}
                size="small"
                sx={{ width: "120px" }}
              >
                Learn more
              </Button>
              <LoginButton sx={{ width: "120px" }}>Get started</LoginButton>
            </Box>
          </Box>
        </Fade>
      </Box>

      {/* Parallax Section with Embedded Vimeo Video */}

      <Fade in={true} timeout={500}>
        <IzeLogoBackground
          sx={(theme) => ({
            height: "55vh",
            [theme.breakpoints.down("sm")]: {
              height: "40vh",
            },
          })}
        >
          <Box
            sx={(theme) => ({
              position: "relative",
              width: "80%",
              height: "80%",
              [theme.breakpoints.down("sm")]: {
                width: "90%",
                height: "90%",
              },
            })}
          >
            <iframe
              src="https://player.vimeo.com/video/1056860875?badge=0&autopause=0&player_id=0&app_id=58479" // Replace with your Vimeo video ID
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
              frameBorder="0"
              allow="autoplay; fullscreen"
              allowFullScreen
              title="Embedded Vimeo Video"
            />
          </Box>
        </IzeLogoBackground>
      </Fade>
      <InfoBoxesSection />
      <UseCasesSection />
      <ContactSection />
      <Box
        sx={{
          backgroundColor: "#EADDFF",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: 4,
          padding: 2,
          paddingLeft: 4,
        }}
      >
        <a href="/terms" target="_blank" rel="noopener">
          Terms of Service
        </a>{" "}
        <a href="/privacy" target="_blank" rel="noopener">
          Privacy Policy
        </a>
      </Box>
    </Box>
  );
};

export default UnauthenticatedHome;
