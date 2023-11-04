import Launch from "@mui/icons-material/Launch";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

import { RequestSummaryPartsFragment } from "../../../../graphql/generated/graphql";
import { RequestInputTable, SubmitResponse } from "../../Request";
import { RequestProps } from "../mockData";

export const ExpandedRequest = ({
  request,
  collapseRow,
}: {
  request: RequestSummaryPartsFragment;
  collapseRow: () => void;
}) => {
  const navigate = useNavigate();

  return (
    <Box
      sx={(theme) => ({
        display: "flex",
        padding: "20px 30px",
        flexDirection: "column",
        alignOtems: "flex-start",
        gap: "8px",
        alignSelf: "stretch",
        [theme.breakpoints.down("md")]: {
          padding: "8px",
        },
      })}
    >
      <Box
        sx={(theme) => ({
          display: "flex",
          padding: "1px",
          alignItems: "center",
          alignSelf: "stretch",
          border: "1px solid #E5E5E5",
          [theme.breakpoints.down("sm")]: {
            flexDirection: "column",
          },
        })}
      >
        <Box
          sx={(theme) => ({
            display: "flex",
            padding: "16px",
            flexDirection: "column",
            justifyContent: "flex-end",
            alignItems: "flex-start",
            gap: "8px",
            flex: "1 0 0",
            alignSelf: "stretch",
            background: "var(--m-3-white, #FFF)",
            [theme.breakpoints.up("sm")]: {
              borderRight: "1px solid #E5E5E5",
              borderBottom: "none",
            },
          })}
        >
          <Typography variant="body1">{request.name}</Typography>
          <Box sx={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <Button
              variant={"outlined"}
              size="small"
              startIcon={<Launch />}
              sx={{ width: "100px" }}
              onClick={() => {
                navigate(`/request/${request.id}`);
              }}
            >
              Request
            </Button>
            <Button
              variant={"outlined"}
              size="small"
              startIcon={<Launch />}
              sx={{ width: "100px" }}
              onClick={() => {
                navigate(`/process/${request.process.id}`);
              }}
            >
              Process
            </Button>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            flex: "1 0 0",
            alignSelf: "stretch",
            background: "var(--m-3-white, #FFF)",
          }}
        >
          <RequestInputTable inputs={request.inputs} rowSize="small" />
        </Box>
      </Box>
      <Paper elevation={2}>
        <SubmitResponse
          displayAsColumn={false}
          options={request.process.options}
          onSubmit={() => collapseRow()}
        />
      </Paper>
    </Box>
  );
};
