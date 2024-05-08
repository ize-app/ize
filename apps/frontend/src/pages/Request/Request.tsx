import { useQuery } from "@apollo/client";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { SnackbarContext } from "../../contexts/SnackbarContext";
import { GetRequestDocument, ResponseFragment } from "../../graphql/generated/graphql";
import Head from "../../layout/Head";
import PageContainer from "../../layout/PageContainer";
import { shortUUIDToFull } from "../../utils/inputs";
import { Accordion } from "../../components/Accordion";
import Loading from "../../components/Loading";
import { ResponseForm } from "@/components/Form/ResponseForm/ResponseForm";
import { ConfigDiagramRequest } from "@/components/ConfigDiagram/ConfigDiagramRequest/ConfigDiagramRequest";

export const Request = () => {
  const { requestId: shortRequestId } = useParams();
  const requestId = shortUUIDToFull(shortRequestId as string);
  const { setSnackbarData, setSnackbarOpen } = useContext(SnackbarContext);
  const navigate = useNavigate();

  let canRespond: boolean = false;
  let userResponses: ResponseFragment[] | undefined = undefined;
  let allowMultipleResponses: boolean = false;

  const { data, loading, error } = useQuery(GetRequestDocument, {
    variables: {
      requestId: requestId,
    },
  });

  const onError = () => {
    navigate("/");
    setSnackbarOpen(true);
    setSnackbarData({ message: "Cannot find this request", type: "error" });
  };

  if (error) onError();

  const request = data?.getRequest;
  // console.log(request);

  if (request) {
    canRespond = request.flow.steps[request.currentStepIndex].userPermission.response ?? false;
    userResponses = request.steps[request.currentStepIndex].userResponses;
    allowMultipleResponses =
      request.flow.steps[request.currentStepIndex].allowMultipleResponses ?? false;
  }

  const theme = useTheme();
  // const isOverMdScreen = useMediaQuery(theme.breakpoints.up("md"));

  return loading || !request ? (
    <Loading />
  ) : (
    <PageContainer>
      <Head
        title={"Request for " + request.flow.name}
        description={"Request for " + request.flow.name}
      />
      <Box sx={{ display: "flex", flexDirection: "column", gap: "30px" }}>
        <Box>
          <Box>
            <Typography variant={"body1"} fontWeight={600} color="primary">
              Request
            </Typography>
            <Typography variant={"h1"} marginTop="8px">
              {request.name}
            </Typography>
            <Typography variant={"h2"} marginTop="8px">
              {request.flow.name}
            </Typography>
          </Box>
          {canRespond &&
            ((userResponses && userResponses.length === 0) || allowMultipleResponses) && (
              <Accordion
                id="submit-response-panel"
                defaultExpanded={true}
                label={"Respond"}
                elevation={6}
              >
                <ResponseForm
                  requestStepId={request.steps[request.currentStepIndex].requestStepId}
                  responseFields={request.steps[request.currentStepIndex].responseFields}
                />
              </Accordion>
            )}
          <Box
            sx={(theme) => ({
              display: "flex",
              flexDirection: "row",
              width: "100%",
              gap: "30px",
              flexWrap: "wrap",
              [theme.breakpoints.down("md")]: {
                flexDirection: "column",
                gap: "8px",
              },
            })}
          >
            <Box sx={{ display: "flex", flexDirection: "row", gap: "12px" }}>
              {/* <RemainingTime
                expirationDate={new Date(Date.parse(request.expirationDate))}
                result={request.result ?? undefined}
              /> */}
            </Box>
            <Box sx={{ display: "flex", gap: ".3rem" }}>
              {/* <Typography variant="body1"> Requested by </Typography>{" "} */}
              {/* <NameWithPopper agents={[request.creator]} name={request.creator.name} /> */}
            </Box>
          </Box>
        </Box>
        <ConfigDiagramRequest request={request} />
        <Box
          sx={(theme) => ({
            display: "flex",
            gap: "100px",
            justifyContent: "space-between",
            [theme.breakpoints.down("md")]: {
              flexDirection: "column-reverse",
              gap: "24px",
            },
          })}
        >
          <Box
            sx={(theme) => ({
              [theme.breakpoints.up("md")]: {
                flex: "1 400px",
              },
            })}
          ></Box>
          <Box
            sx={{
              [theme.breakpoints.up("md")]: {
                flex: "2 300px",
              },
            }}
          ></Box>
        </Box>
      </Box>
    </PageContainer>
  );
};
