import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useRef, useState } from "react";

import aiAgentUrl from "@/assets/ai-agent.svg";
import discordUrl from "@/assets/discord-logo-blue.svg";
import myceliumUrl from "@/assets/mycelium.svg";
import processUrl from "@/assets/process.svg";
import slackUrl from "@/assets/slack-logo.svg";
import telegramUrl from "@/assets/telegram-logo.svg";

const infoBoxes = [
  {
    title: "The Ize process language",
    description:
      "Ize can represent any kind of online collective process. This can include decisions, synthesizing opinions, and controlling access to shared resources. These processes span the boundaries of teams, tools, and web2/web3 identities.",
    reverse: false,
    visual: (
      <Box
        component="img"
        src={processUrl}
        alt="Ize Logo"
        sx={{
          // width: "160px",
          width: "20%",
          maxHeight: "100px",
          // mb: 4,
        }}
      />
    ),
  },
  {
    title: "Bottoms-up collaboration",
    description:
      "In Ize, everything is a collective process. There is no concept of an admin in Ize. Even a evolving process itself happens through a collective process.",
    reverse: true,
    visual: (
      <Box
        component="img"
        src={myceliumUrl}
        alt="Ize Logo"
        sx={{
          // width: "160px",
          width: "20%",
          maxHeight: "100px",
        }}
      />
    ),
  },
  {
    title: "The AI agent <> team interface",
    description:
      "With Ize, teams can both govern AI agents and integrate AI agents into their collective processes.",
    reverse: false,
    visual: (
      <Box
        component="img"
        src={aiAgentUrl}
        alt="Ize Logo"
        sx={{
          // width: "160px",
          width: "20%",
          maxHeight: "100px",
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
          // width: "160px",
          width: "20%",
          maxHeight: "100px",
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <Box component="img" src={telegramUrl} alt="Ize Logo" sx={{ height: "35px" }} />
        <Box component="img" src={slackUrl} alt="Ize Logo" sx={{ maxHeight: "40px" }} />
        <Box component="img" src={discordUrl} alt="Ize Logo" sx={{ maxHeight: "30px" }} />
        {/* <Box component="img" src={emailUrl} alt="Ize Logo" sx={{ maxHeight: "40px" }} /> */}
      </Box>
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
        gap: 5,
        display: "flex",
        flexDirection: reverse ? "row-reverse" : "reverse",
        justifyContent: "space-between",
        alignItems: "center",
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
          // width: "100%",
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
    const segment = 1 / 4;
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
        gap: 3,
        px: 4,
        paddingTop: 8,
        paddingBottom: 8,
        // height: "100vh",
      }}
    >
      {infoBoxes.map((content, index) => (
        <InfoBox
          key={index}
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
