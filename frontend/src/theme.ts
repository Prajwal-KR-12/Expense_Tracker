import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#673ab7', // Deep Purple
    },
    secondary: {
      main: '#00bcd4', // Cyan/Teal
    },
    background: {
      default: '#f4f6f8',
    },
  },
  typography: {
    fontFamily: ['Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
    h4: {
      fontWeight: 600,
    },
  },
});

export default theme;
