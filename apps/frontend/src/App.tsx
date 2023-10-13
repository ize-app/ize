import { ApolloProvider } from "@apollo/client";
import { Global } from "@emotion/react";
import { ThemeProvider } from "@mui/material/styles";
import { RouterProvider } from "react-router-dom";
import { apolloClient } from "./apollo";
import { CurrentUserProvider } from "./contexts/current_user_context";
import { SnackbarProvider } from "./contexts/SnackbarContext";
import { router } from "./routers/router";
import muiTheme from "./style/muiTheme";
import GlobalStyles from "./style/global";

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <Global styles={GlobalStyles} />
      <ThemeProvider theme={muiTheme}>
        <CurrentUserProvider>
          <SnackbarProvider>
            <RouterProvider router={router} />
          </SnackbarProvider>
        </CurrentUserProvider>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;
