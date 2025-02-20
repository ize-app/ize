import { Box, Fade, Typography } from "@mui/material";
import { useInView } from "react-intersection-observer";

import aiAgentUrl from "@/assets/ai-agent.svg";
import brainstormUrl from "@/assets/brainstorm.svg";
import budgetUrl from "@/assets/budget.svg";
import calendarUrl from "@/assets/calendar.svg";
import decisionUrl from "@/assets/decision.svg";
import delegateUrl from "@/assets/delegate.svg";
import electionUrl from "@/assets/election.svg";
import expensesUrl from "@/assets/expenses.svg";
import moderationUrl from "@/assets/moderation.svg";
import permissionUrl from "@/assets/permission.svg";
import rainbowUrl from "@/assets/rainbow.svg";
import roadmapUrl from "@/assets/roadmap.svg";

interface UseCase {
  title: string;
  imgUrl: string;
}

const useCases: UseCase[] = [
  { title: "Synthesize opinions", imgUrl: brainstormUrl },
  { title: "Decide on proposals", imgUrl: decisionUrl },
  { title: "Manage shared calendars", imgUrl: calendarUrl },
  { title: "Govern AI agents", imgUrl: aiAgentUrl },
  { title: "Distribute communal funds", imgUrl: expensesUrl },
  { title: "Prioritize roadmaps", imgUrl: roadmapUrl },
  { title: "Cross-org coordination", imgUrl: budgetUrl },
  { title: "Moderate community tools", imgUrl: moderationUrl },
  { title: "Elect leaders", imgUrl: electionUrl },
  { title: "Delegate authority", imgUrl: delegateUrl },
  { title: "Grant access", imgUrl: permissionUrl },
  /// TODO Cross-organizational collaboration
  { title: "Endless possibilities...", imgUrl: rainbowUrl },
];

export const UseCase = ({ title, imgUrl }: UseCase) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
        textAlign: "center",
        maxWidth: "200px",
        height: "100px",
      }}
    >
      <Box component="img" src={imgUrl} alt="Ize Logo" sx={{ width: "40%", maxHeight: "40px" }} />
      <Typography
        variant="label"
        sx={{ fontFamily: "Sora", fontWeight: 400, textAlign: "left", width: "100px" }}
      >
        {title}
      </Typography>
    </Box>
  );
};

export const UseCasesSection = () => {
  const { ref, inView } = useInView({
    threshold: 0,
  });
  console.log("inView", inView);

  return (
    <Fade in={inView} timeout={2500}>
      <Box
        ref={ref}
        sx={{
          backgroundColor: "white",
          display: "flex",
          flexDirection: "column",
          // flexWrap: "wrap",
          // maxWidth: "600px",
          gap: 2,
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 6,
          paddingTop: 1,
          paddingLeft: 1,
          paddingRight: 1,
        }}
      >
        <Typography
          variant="h5"
          color={"primary"}
          fontWeight={500}
          sx={{ fontFamily: "Sora", textAlign: "center" }}
        >
          Build any kind of collective process....
        </Typography>
        <Box
          sx={{
            backgroundColor: "white",
            display: "flex",
            flexWrap: "wrap",
            maxWidth: "600px",
            fontFamily: "Sora",
            gap: 2,
            justifyContent: "space-around",
          }}
        >
          {useCases.map((useCase, index) => (
            <UseCase key={index} {...useCase} />
          ))}
        </Box>
      </Box>
    </Fade>
  );
};
