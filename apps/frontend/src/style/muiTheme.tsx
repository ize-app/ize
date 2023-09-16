import { createTheme } from "@mui/material/styles";

import * as style from "./style";

declare module "@mui/material/styles" {
  interface TypographyVariants {
    label: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    label?: React.CSSProperties;
  }
}

// Update the Typography's variant prop options
declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    label: true;
  }
}

const muiTheme = createTheme({
  palette: {
    primary: {
      main: style.colors.primary,
    },
    secondary: {
      main: style.colors.secondary,
    },
    error: {
      main: style.colors.error,
    },
  },
  typography: {
    button: {
      textTransform: "none",
    },
    label: {
      fontSize: ".875rem",
      color: style.colors.secondary,
      fontWeight: 500,
      letterSpacing: ".05rem",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "1rem",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          "& a": {
            textDecoration: "none",
            color: "black",
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-root": {
            color: style.colors.primary,
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          width: "30px",
          height: "30px",
          fontSize: ".875rem",
        },
      },
    },
  },
});

export default muiTheme;
