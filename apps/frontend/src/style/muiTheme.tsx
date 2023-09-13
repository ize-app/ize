import { createTheme  } from '@mui/material/styles';

const muiTheme = createTheme({
  palette: {
    primary: {
      main: '#6750A4'
    },
    secondary: {
      main: '#625B71'
    },
    error: {
      main: '#B3261E'
    }
  },
  typography: {
    button: {
      textTransform: "none"
    }
  },
});

export default muiTheme;
