import { createTheme } from "@mui/material/styles";

import * as style from "./style";

declare module "@mui/material/styles" {
  interface TypographyVariants {
    label: React.CSSProperties;
    label2: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    label?: React.CSSProperties;
    label2?: React.CSSProperties;
  }
}

// Update the Typography's variant prop options
declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    label: true;
    label2: true;
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
    h1: {
      fontSize: "1.75rem",
      fontWeight: "400",
      margin: "1rem 0rem",
    },
    h2: {
      fontSize: "1.5rem",
    },
    h3: {
      fontSize: "1.25rem",
    },
    label: {
      fontSize: ".875rem",
      color: style.colors.primary,
      fontWeight: 500,
      letterSpacing: ".05rem",
    },
    label2: {
      fontSize: ".7rem",
      color: style.colors.primary,
      fontWeight: 500,
      letterSpacing: ".1rem",
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
            backgroundColor: "inherit",
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
    MuiBadge: {
      styleOverrides: {
        root: {
          zIndex: 0,
        },
      },
    },
  },
});

export default muiTheme;
