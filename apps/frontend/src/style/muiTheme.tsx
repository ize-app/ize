import { createTheme  } from '@mui/material/styles';

import * as style from './style'


declare module '@mui/material/styles' {
  interface TypographyVariants {
    navBarLink: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    navBarLink?: React.CSSProperties;
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    navBarLink: true;
    h3: false;
  }
}

const muiTheme = createTheme({
  palette: {
    primary: {
      main: style.colors.primary
    },
    secondary: {
      main: style.colors.secondary
    },
    error: {
      main: style.colors.error
    }
  },
  typography: {
    button: {
      textTransform: "none"
    },
    navBarLink: {
      fontSize: '1rem',
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '1rem',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides:{
        root: {
          '& a': {
            textDecoration: 'none',
            color: 'black'
          }
        }
      }
    }
  },
});

export default muiTheme;
