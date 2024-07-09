import { ApolloProvider } from "@apollo/client";
import { Global } from "@emotion/react";
import { ThemeProvider } from "@mui/material/styles";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StytchProvider } from "@stytch/react";
import { HelmetProvider } from "react-helmet-async";
import { RouterProvider } from "react-router-dom";

import { CurrentUserProvider } from "./contexts/current_user_context";
import { RecentAgentsProvider } from "./contexts/RecentAgentContext";
import { SnackbarProvider } from "./contexts/SnackbarContext";
import { apolloClient } from "./graphql/apollo";
import { router } from "./routers/router";
import GlobalStyles from "./style/global";
import muiTheme from "./style/muiTheme";
import { stytchClient } from "./stytch";

function App() {
  return (
    <StytchProvider stytch={stytchClient}>
      <ApolloProvider client={apolloClient}>
        <HelmetProvider>
          <Global styles={GlobalStyles} />
          <ThemeProvider theme={muiTheme}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <CurrentUserProvider>
                <SnackbarProvider>
                  <RecentAgentsProvider>
                    <RouterProvider router={router} />
                  </RecentAgentsProvider>
                </SnackbarProvider>
              </CurrentUserProvider>
            </LocalizationProvider>
          </ThemeProvider>
        </HelmetProvider>
      </ApolloProvider>
    </StytchProvider>
  );
}

export default App;
