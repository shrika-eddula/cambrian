import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { ExperimentBuilder } from './components/ExperimentBuilder';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#9c27b0',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ExperimentBuilder />
    </ThemeProvider>
  );
}

export default App;
