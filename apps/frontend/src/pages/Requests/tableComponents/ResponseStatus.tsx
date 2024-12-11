import BoltIcon from "@mui/icons-material/Bolt";
import { Box, Typography, useTheme } from "@mui/material";

import { ResultGroupStatusDisplay } from "@/components/result/Results/ResultGroupStatus";
import { stringifyValue } from "@/components/Value/stringifyValue";
import { ActionStatus, RequestSummaryFragment } from "@/graphql/generated/graphql";

import { ExpirationStatus } from "./ExpirationStatus";

export const ResponseStatus = ({ request }: { request: RequestSummaryFragment }) => {
  const responseComplete = request.currentStep.status.responseFinal;
  const resultGroup = request.currentStep.result;
  const result = request.currentStep.result?.results[0];
  const action = request.currentStep.action;
  const userResponded = request.currentStep.userResponded;
  const responsePermission = request.currentStep.userRespondPermission;
  const theme = useTheme();

  if (!responseComplete) {
    if (userResponded)
      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "4px",
            width: "100px",
          }}
        >
          {/* <CheckCircleIcon color={"success"} fontSize="small" /> */}
          <Typography variant="description" fontSize={".75rem"} color={theme.palette.success.main}>
            Responded
          </Typography>
        </Box>
      );
    else if (!responsePermission) {
      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "4px",
            width: "100px",
          }}
        >
          {/* <ExpirationStatus expirationDate={new Date(expirationDate)} /> */}
          <Typography
            variant="description"
            textAlign={"right"}
            fontSize={".75rem"}
            color={theme.palette.secondary.main}
          >
            You don&apos;t have respond permission
          </Typography>
        </Box>
      );
    } else {
      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "4px",
            width: "100px",
          }}
        >
          <ExpirationStatus expirationDate={new Date(request.currentStep.expirationDate)} />
          <Typography variant="description" fontSize={".75rem"} color={theme.palette.warning.main}>
            No response
          </Typography>
        </Box>
      );
    }
  } else {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          flexDirection: "column",
          gap: "4px",
          padding: "0 4px",
        }}
      >
        {result && result.resultItems.length > 0 ? (
          <Typography
            variant="description"
            color={theme.palette.info.main}
            fontWeight={500}
            sx={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: "2",
              whiteSpace: "normal",
              overflow: "hidden",
              textOverflow: "ellipsis",
              textAlign: "right",
            }}
          >
            {result.resultItems.map((ri) => stringifyValue({ value: ri.value })).join(", ")}
          </Typography>
        ) : (
          <ResultGroupStatusDisplay status={resultGroup?.status} resultType={result?.type} />
        )}
        {action && [ActionStatus.Complete, ActionStatus.Attempting].includes(action.status) ? (
          <Box sx={{ display: "flex", gap: "4px", justifyContent: "flex-end" }}>
            <BoltIcon color="secondary" fontSize="small" />
            {/* <Typography variant="description" color="secondary">
              Action:
            </Typography> */}
            <Typography
              variant="description"
              color="secondary"
              sx={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: "1",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {action.name}
            </Typography>
          </Box>
        ) : (
          <Typography
            variant="description"
            // fontWeight={500}
            color="secondary"
            sx={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: "1",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Final
          </Typography>
        )}
      </Box>
    );
  }
};
