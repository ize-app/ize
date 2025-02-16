import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useRef, useState } from "react";

import discordUrl from "@/assets/discord-logo-blue.svg";
import emailUrl from "@/assets/email.svg";
import myceliumUrl from "@/assets/mycelium.svg";
import processUrl from "@/assets/process.svg";
import slackUrl from "@/assets/slack-logo.svg";
import telegramUrl from "@/assets/telegram-logo.svg";

const infoBoxes = [
  {
    title: "The Ize process language",
    description:
      "Ize can represent any kind of online collective process. This can range from simple decisions to multi-step AI-assisted sensemaking to collective management of shared resources. These processes can span across web2/web3 idenities and tools.",
    reverse: false,
    visual: (
      <Box
        component="img"
        src={processUrl}
        alt="Ize Logo"
        sx={{
          width: "30%",
          maxHeight: "150px",
          mb: 4,
        }}
      />
    ),
  },
  {
    title: "Native chat integrations",
    description:
      "Your team can participate in Ize processes wherever your team works - Slack, Telegram, Discord, SMS, etc",
    reverse: true,
    visual: (
      <Box
        sx={{
          width: "30%",
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          alignItems: "flexStart",
        }}
      >
        <Box
          component="img"
          src={telegramUrl}
          alt="Ize Logo"
          sx={{ width: "40%", maxHeight: "40px" }}
        />
        <Box
          component="img"
          src={slackUrl}
          alt="Ize Logo"
          sx={{ width: "40%", maxHeight: "40px" }}
        />
        <Box
          component="img"
          src={discordUrl}
          alt="Ize Logo"
          sx={{ width: "40%", maxHeight: "40px" }}
        />
        <Box
          component="img"
          src={emailUrl}
          alt="Ize Logo"
          sx={{ width: "40%", maxHeight: "40px" }}
        />
      </Box>
    ),
  },
  {
    title: "Bottoms-up collaboration",
    description:
      "In Ize, everything is collective process. There is no concept of an admin in Ize. Even evolving process, itself, happens through collective process. ",
    reverse: false,
    visual: (
      <Box
        component="img"
        src={myceliumUrl}
        alt="Ize Logo"
        sx={{ width: "30%", maxHeight: "150px" }}
      />
    ),
  },
];

const InfoBox = ({
  title,
  description,
  getOpacityForBox,
  index,
  visual,
  reverse = false,
}: {
  title: string;
  description: string;
  getOpacityForBox: (index: number) => number;
  index: number;
  visual: React.ReactNode;
  reverse?: boolean;
}) => {
  const theme = useTheme();
  const isSmallScreenSize = useMediaQuery(theme.breakpoints.down("sm"));
  const currentOpacity = getOpacityForBox(index);
  return (
    <Box
      key={title}
      sx={(theme) => ({
        p: 2,
        textAlign: "left",
        [theme.breakpoints.down("sm")]: {
          flexDirection: "column",
        },
        borderRadius: 2,
        width: "100%",
        maxWidth: 800,
        // Flex child will take equal space on larger screens.
        flex: 1,
        display: "flex",
        flexDirection: reverse ? "row-reverse" : "reverse",
        justifyContent: "space-between",
        transition: "opacity 0.2s linear, transform 0.2s linear",
      })}
      style={{
        opacity: currentOpacity,
        // Slide effect: when opacity is 0 the element is offset,
        // and slides to position (translateX(0)) as opacity increases.
        transform: `translateX(${(1 - currentOpacity) * (reverse ? 20 : -20)}vw)`,
      }}
    >
      <Box
        sx={(theme) => ({
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          width: "70%",
          [theme.breakpoints.down("sm")]: {
            width: "100%",
          },
        })}
      >
        <Typography variant="h5" fontFamily="Sora" color="primary" sx={{ fontWeight: 500 }}>
          {title}
        </Typography>
        <Typography variant="body1" color="secondary">
          {description}
        </Typography>
      </Box>
      {!isSmallScreenSize && visual}
    </Box>
  );
};

export const InfoBoxesSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);

  // Update the progress based on the container's position.
  const updateProgress = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollDistance = window.innerHeight + rect.height;
      // Multiply by 2 to make the fade in happen faster.
      const p = ((window.innerHeight - rect.top) / totalScrollDistance) * 2;
      const clamped = Math.max(0, Math.min(1, p));
      setProgress(clamped);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", updateProgress);
    updateProgress();
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  // Each box is assigned a segment of progress (1/3 each).
  const getOpacityForBox = (index: number) => {
    const segment = 1 / 3;
    const start = index * segment;
    const normalized = (progress - start) / segment;
    return Math.max(0, Math.min(1, normalized));
  };

  return (
    <Box
      ref={containerRef}
      sx={{
        backgroundColor: "#fff",
        // py: 8,
        overflowX: "hidden",
        flexDirection: "column",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        px: 4,
        paddingTop: 8,
        paddingBottom: 8,
      }}
    >
      {infoBoxes.map((content, index) => (
        <InfoBox
          key={content.title}
          title={content.title}
          description={content.description}
          getOpacityForBox={getOpacityForBox}
          index={index}
          reverse={content.reverse}
          visual={content.visual}
        />
      ))}
    </Box>
  );
};
