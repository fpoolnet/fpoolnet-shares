import { createTheme, Theme } from '@mui/material/styles';
import { PRIMARY_BLUE_3 } from '@styles/colors';

const customTheme = (outerTheme: Theme) =>
  createTheme({
    palette: {
      mode: outerTheme.palette.mode
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: PRIMARY_BLUE_3
          }
        }
      }
    }
  });

export default customTheme;
